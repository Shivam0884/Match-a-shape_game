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
  const [paused, setPaused] = useState(false);

  const basketRef = useRef();
  const containerRef = useRef();
  const [fallingShapes, setFallingShapes] = useState([
    { id: 1, shape: getRandomShape(), x: Math.random() * 70 + 15 },
  ]);
  const nextShapeId = useRef(2);

  // Basket movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") setBasketX((x) => Math.max(x - 5, 5));
      if (e.key === "ArrowRight") setBasketX((x) => Math.min(x + 5, 85));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.min(Math.max(x, 5), 85));
  };

  const handleGameOver = () => {
    setGameOver(true);
    API.post("/game/update-score", { level }).catch((err) =>
      console.error(err)
    );
  };

  const renderShape = (shape, size = 80) => (
    <img
      src={shape.image}
      alt={shape.name}
      style={{ width: size, height: size }}
    />
  );

  // Add new shape
  const addShape = () => {
    setFallingShapes((prev) => [
      ...prev,
      {
        id: nextShapeId.current++,
        shape: getRandomShape(),
        x: Math.random() * 70 + 15,
      },
    ]);
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
      {/* Left Panel */}
      <div style={{ width: "30%", textAlign: "center" }}>
        <h2>Catch This Shape:</h2>
        {renderShape(targetShape)}
        <h4>Level: {level} / 5</h4>
        <h4>Player: {userName}</h4>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setPaused(!paused)}
            style={{ marginRight: 10 }}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      </div>

      {/* Right Panel */}
      <div
        ref={containerRef}
        style={{
          width: "50%",
          height: "500px",
          border: "3px dashed gray",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#d0f0c0",
        }}
        onMouseMove={handleMouseMove}
      >
        {fallingShapes.map((s) => (
          <FallingShape
            key={s.id}
            shape={s}
            containerRef={containerRef}
            basketRef={basketRef}
            targetShape={targetShape}
            setTargetShape={setTargetShape}
            level={level}
            setLevel={setLevel}
            paused={paused}
            gameOver={gameOver}
            handleGameOver={handleGameOver}
            addShape={addShape}
          />
        ))}

        {/* Basket */}
        <div
          ref={basketRef}
          style={{
            position: "absolute",
            bottom: "10px",
            left: `${basketX}%`,
            transform: "translateX(-50%)",
            width: "160px",
            height: "80px",
            backgroundColor: "#a0522d",
            borderRadius: "20px 20px 50px 50px",
            border: "3px solid #8b4513",
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "32px",
            lineHeight: "80px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}
        >
          🧺
        </div>
      </div>

      {gameOver && (
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
          <h2>🎉 Game Over!</h2>
          <h3>Reached Level: {level}</h3>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
}

// FallingShape component
function FallingShape({
  shape,
  containerRef,
  basketRef,
  targetShape,
  setTargetShape,
  level,
  setLevel,
  paused,
  gameOver,
  handleGameOver,
  addShape,
}) {
  const controls = useAnimation();
  const shapeRef = useRef();

  useEffect(() => {
    if (!paused && !gameOver) {
      const duration = Math.max(1, 5 - level * 0.6);
      controls.start({ y: 400, transition: { duration, ease: "linear" } });
    }
  }, [paused, gameOver, level, controls]);

  const onUpdate = (latest) => {
    const containerHeight = containerRef.current.offsetHeight;
    if (latest.y / containerHeight >= 0.3 && !shape.spawnedNext) {
      addShape();
      shape.spawnedNext = true;
    }
  };

  const onComplete = async () => {
    const basketRect = basketRef.current.getBoundingClientRect();
    const shapeRect = shapeRef.current.getBoundingClientRect();

    const diffX = Math.abs(
      shapeRect.x + shapeRect.width / 2 - (basketRect.x + basketRect.width / 2)
    );

    if (diffX <= 60) {
      if (shape.shape.name === targetShape.name) {
        setLevel((l) => Math.min(l + 1, 5));
        setTargetShape(getRandomShape());
      } else {
        handleGameOver();
      }
    }

    if (!gameOver && !paused) {
      // reset animation
      controls.set({ y: 0 });
      controls.start({
        y: 400,
        transition: { duration: Math.max(1, 5 - level * 0.6), ease: "linear" },
      });
    }
  };

  return (
    <motion.div
      ref={shapeRef}
      id={`falling-shape-${shape.id}`}
      animate={controls}
      onUpdate={onUpdate}
      onAnimationComplete={onComplete}
      style={{
        position: "absolute",
        top: 0,
        left: `${shape.x}%`,
        transform: "translateX(-50%)",
      }}
    >
      <img
        src={shape.shape.image}
        alt={shape.shape.name}
        style={{ width: 80, height: 80 }}
      />
    </motion.div>
  );
}
