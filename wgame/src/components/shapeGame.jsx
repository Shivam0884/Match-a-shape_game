import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { shapesData } from "../images/shapes";
import API from "../api";

const getRandomShape = () =>
  shapesData[Math.floor(Math.random() * shapesData.length)];

export default function ShapeGame({ userName }) {
  const [targetShape, setTargetShape] = useState(getRandomShape());
  const [basketX, setBasketX] = useState(45);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fallingShapes, setFallingShapes] = useState([]);

  const basketRef = useRef();
  const containerRef = useRef();
  const nextShapeId = useRef(1);

  useEffect(() => {
    // Start first shape
    spawnNextShape();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 🧺 Move Basket with Arrow keys */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") setBasketX((x) => Math.max(x - 5, 5));
      if (e.key === "ArrowRight") setBasketX((x) => Math.min(x + 5, 95));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /** 🖱️ Basket moves with mouse */
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.min(Math.max(x, 5), 95));
  };

  /** 🎮 Game Over and Win logic */
  const handleGameOver = () => {
    if (!gameOver && !won) {
      setGameOver(true);
      API.post("/game/update-score", { level }).catch(console.error);
    }
  };
  const handleWin = () => {
    if (!won) {
      setWon(true);
      API.post("/game/update-score", { level: 5 }).catch(console.error);
    }
  };

  /** 🎨 Helper to render target shape */
  const renderShape = (shape, size = 80) => (
    <img
      src={shape.image}
      alt={shape.name}
      style={{ width: size, height: size }}
    />
  );

  /** 🌈 Spawn a single new falling shape */
  const spawnNextShape = (delay = 0) => {
    if (gameOver || won) return;
    setTimeout(() => {
      if (gameOver || won) return;
      setFallingShapes((prev) => {
        if (prev.length >= 2) return prev; // keep only 2 on screen max for ease
        const newShape = {
          id: nextShapeId.current++,
          shape: getRandomShape(),
          x: Math.random() * 70 + 15,
          startY: -Math.random() * 100 - 100,
          delayStart: Math.random() * 0.3,
        };
        return [...prev, newShape];
      });
    }, delay);
  };

  /** Remove shape from state */
  const removeShape = (id) => {
    setFallingShapes((prev) => prev.filter((s) => s.id !== id));
  };

  /** ✅ When correct shape caught */
  const handleCorrectCatch = (id) => {
    removeShape(id);
    if (level >= 5) handleWin();
    else {
      setLevel((l) => l + 1);
      setTargetShape(getRandomShape());
      setTimeout(() => spawnNextShape(800), 400);
    }
  };

  /** ❌ Wrong shape caught */
  const handleWrongCatch = (id) => {
    removeShape(id);
    handleGameOver();
  };

  /** ❌ Missed target shape */
  const handleMissedTarget = (id) => {
    removeShape(id);
    handleGameOver();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100vh",
        padding: "20px 60px",
        position: "relative",
      }}
    >
      {/* --- Left Info Panel --- */}
      <div
        style={{
          width: "30%",
          textAlign: "center",
          background: "linear-gradient(135deg, #fef9e7 0%, #f9e79f 100%)",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          border: "2px solid #91f45fff",
          color: "#4a3f0b",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2>🎯 Catch This Shape</h2>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "15px",
            display: "inline-block",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ transform: "scale(1.5)" }}>
            {renderShape(targetShape)}
          </div>
        </div>

        <h4 style={{ marginTop: "20px" }}>
          ⭐ Level: <b>{level} / 5</b>
        </h4>
        <h4>
          👤 Player: <b>{userName}</b>
        </h4>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setPaused(!paused)}
            className="btn btn-warning me-2 shadow-sm"
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-danger shadow-sm"
          >
            🔄 Restart
          </button>
        </div>
      </div>

      {/* --- Game Area --- */}
      <div
        ref={containerRef}
        style={{
          width: "65%",
          height: "550px",
          border: "3px dashed gray",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#bceaa5ff",
        }}
        onMouseMove={handleMouseMove}
      >
        {fallingShapes.map((s) => (
          <FallingShape
            key={s.id}
            instance={s}
            containerRef={containerRef}
            basketRef={basketRef}
            targetShape={targetShape}
            level={level}
            paused={paused}
            gameOver={gameOver || won}
            spawnNextShape={spawnNextShape}
            onCorrectCatch={() => handleCorrectCatch(s.id)}
            onWrongCatch={() => handleWrongCatch(s.id)}
            onMissedTarget={() => handleMissedTarget(s.id)}
            removeShape={() => removeShape(s.id)}
          />
        ))}

        {/* 🧺 Basket */}
        <div
          ref={basketRef}
          style={{
            position: "absolute",
            bottom: "10px",
            left: `${basketX}%`,
            transform: "translateX(-50%)",
            width: "180px",
            height: "90px",
            background: "linear-gradient(135deg, #c28b55 0%, #8b5a2b 100%)",
            borderRadius: "25px 25px 60px 60px",
            boxShadow:
              "inset 0 4px 8px rgba(255, 255, 255, 0.3), 0 6px 15px rgba(0,0,0,0.4)",
            borderTop: "6px solid #d2a679",
            borderBottom: "6px solid #5a3310",
            textAlign: "center",
            fontSize: "40px",
          }}
        >
          🧺
        </div>
      </div>

      {/* --- Popup --- */}
      {(gameOver || won) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          <h2>{won ? "🎉 Congratulations!" : "💀 Game Over!"}</h2>
          <h3>{won ? "You Won the Game!" : `Reached Level: ${level}`}</h3>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
}

/* --- Falling Shape Component --- */
function FallingShape({
  instance,
  containerRef,
  basketRef,
  targetShape,
  level,
  paused,
  gameOver,
  spawnNextShape,
  onCorrectCatch,
  onWrongCatch,
  onMissedTarget,
  removeShape,
}) {
  const controls = useAnimation();
  const shapeRef = useRef();
  const caughtRef = useRef(false);

  useEffect(() => {
    if (!paused && !gameOver) {
      const baseSpeed = 6.3 - level * 0.45; // slower for kids, speeds up per level
      const duration = Math.max(3, baseSpeed + Math.random() * 0.8);
      controls.start({
        y: 460,
        transition: { duration, ease: "easeInOut", delay: instance.delayStart },
      });
    } else controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, gameOver, level]);

  const onComplete = () => {
    if (caughtRef.current) return removeShape();

    const basketRect = basketRef.current?.getBoundingClientRect();
    const shapeRect = shapeRef.current?.getBoundingClientRect();

    if (!basketRect || !shapeRect) {
      if (instance.shape.name === targetShape.name) onMissedTarget();
      else {
        controls.start({ opacity: 0, transition: { duration: 0.4 } });
        spawnNextShape(1000);
        setTimeout(() => removeShape(), 400);
      }
      return;
    }

    const diffX = Math.abs(
      shapeRect.x + shapeRect.width / 2 - (basketRect.x + basketRect.width / 2)
    );

    if (diffX <= 60) {
      caughtRef.current = true;
      if (instance.shape.name === targetShape.name) onCorrectCatch();
      else onWrongCatch();
    } else {
      if (instance.shape.name === targetShape.name) onMissedTarget();
      else {
        controls.start({ opacity: 0, transition: { duration: 0.5 } });
        spawnNextShape(1000);
        setTimeout(() => removeShape(), 400);
      }
    }
  };

  return (
    <motion.div
      ref={shapeRef}
      animate={controls}
      onAnimationComplete={onComplete}
      initial={{ y: instance.startY }}
      style={{
        position: "absolute",
        left: `${instance.x}%`,
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    >
      <img
        src={instance.shape.image}
        alt={instance.shape.name}
        style={{
          width: 80 + level * 5,
          height: 80 + level * 5,
          userSelect: "none",
        }}
      />
    </motion.div>
  );
}
