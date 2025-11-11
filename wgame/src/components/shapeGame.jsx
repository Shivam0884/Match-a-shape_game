import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { shapesData } from "../images/shapes";
import API from "../api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const numShapes = Math.min(5 + Math.floor(level / 3), 8);
    for (let i = 0; i < numShapes; i++) {
      spawnNextShape(i * 600);
    }
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") setBasketX((x) => Math.max(x - 5, 5));
      if (e.key === "ArrowRight") setBasketX((x) => Math.min(x + 5, 95));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.min(Math.max(x, 5), 95));
  };

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

  const renderShape = (shape, size = 80) => (
    <img
      src={shape.image}
      alt={shape.name}
      style={{ width: size, height: size }}
    />
  );

  const spawnNextShape = (delay = 0) => {
    if (gameOver || won) return;
    setTimeout(() => {
      if (gameOver || won) return;
      setFallingShapes((prev) => {
        const maxShapes = Math.min(3 + Math.floor(level / 2), 5);
        if (prev.length >= maxShapes) return prev;
        let newX;
        let safe = false;
        let attempts = 0;
        while (!safe && attempts < 10) {
          newX = Math.random() * 70 + 15;
          safe = prev.every((s) => Math.abs(s.x - newX) > 18);
          attempts++;
        }
        const baseStagger = 400;
        const jitter = Math.random() * 150;
        const delayStart = (prev.length * baseStagger + jitter) / 1000;
        const newShape = {
          id: nextShapeId.current++,
          shape: getRandomShape(),
          x: newX,
          startY: -100 - Math.random() * 50,
          delayStart,
        };
        return [...prev, newShape];
      });
    }, delay);
  };

  const removeShape = (id) => {
    setFallingShapes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCorrectCatch = (id) => {
    removeShape(id);
    if (level >= 5) handleWin();
    else {
      setLevel((l) => l + 1);
      setTargetShape(getRandomShape());
      setTimeout(() => spawnNextShape(600), 400);
    }
  };

  const handleWrongCatch = (id) => {
    removeShape(id);
    handleGameOver();
  };

  const handleMissedTarget = (id) => {
    removeShape(id);
    handleGameOver();
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "transparent",
        cursor: "default",
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          padding: "20px 30px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.6)",
          fontFamily: "'Poppins', sans-serif",
          color: "#2c2c2c",
          textAlign: "center",
          width: "260px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "10px",
            fontWeight: "600",
            color: "#3b3b3b",
          }}
        >
          🎯 Catch This Shape
        </h2>

        <div
          style={{
            background: "rgba(255,255,255,0.7)",
            borderRadius: "15px",
            padding: "10px",
            marginBottom: "12px",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              transform: "scale(1.25)",
              filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.2))",
            }}
          >
            {renderShape(targetShape)}
          </div>
        </div>

        <h4 style={{ margin: "6px 0" }}>⭐ Score {level} / 5</h4>
        <h4 style={{ margin: "6px 0" }}>👤 {userName}</h4>

        <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setPaused(!paused)}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              borderRadius: "10px",
              background: paused
                ? "linear-gradient(135deg, #52c234, #061700)"
                : "linear-gradient(135deg, #ffb347, #ffcc33)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #ff512f, #dd2476)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            🔄 Restart
          </button>
        </div>
      </div>

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

      <div
        ref={basketRef}
        style={{
          position: "absolute",
          bottom: "0%",
          left: `${basketX}%`,
          transform: "translateX(-50%)",
          fontSize: "130px",
          userSelect: "none",
          filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.3))",
        }}
      >
        🧺
      </div>

      {(gameOver || won) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "50px",
            borderRadius: "25px",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
            textAlign: "center",
            zIndex: 20,
            backdropFilter: "blur(20px)",
          }}
        >
          <h2 style={{ fontSize: "32px" }}>
            {won ? "🎉 Congratulations!" : "💀 Game Over!"}
          </h2>
          <h3 style={{ margin: "15px 0" }}>
            {won ? "You Won the Game!" : `Reached Level: ${level}`}
          </h3>
          {won && (
            <div
              style={{
                marginTop: "20px",
                fontSize: "18px",
                color: "#2c3e50",
                fontWeight: "600",
              }}
            >
              🎊 Great Job! You completed all levels successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FallingShape({
  instance,
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
      const baseDuration = Math.max(1.3, 4 - level * 0.8);
      controls.start({
        y: "90vh",
        transition: {
          duration: baseDuration,
          ease: "linear",
          delay: instance.delayStart || 0,
        },
      });
      return () => controls.stop();
    } else controls.stop();
  }, [paused, gameOver, level, controls, instance.delayStart]);

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
          width: 65 + level * 5,
          height: 65 + level * 5,
          userSelect: "none",
          filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.3))",
        }}
      />
    </motion.div>
  );
}
