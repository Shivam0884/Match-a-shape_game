import React, { useState, useEffect, useRef } from "react";
import { shapesData } from "../images/shapes";
import bgImage from "../assets/Desktop - 5.png";
import { useNavigate } from "react-router-dom";

export default function StaticShapeGame() {
  const [targetIndex, setTargetIndex] = useState(0);
  const [positions, setPositions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const generatePositions = () => {
    const newPositions = [];
    const minDistance = 200;
    const shapeSize = 140;
    const padding = 100;

    const screenWidth = window.innerWidth - shapeSize - padding;
    const screenHeight = window.innerHeight - shapeSize - padding;

    const leftBoundary = window.innerWidth * 0.25;
    const topBoundary = window.innerHeight * 0.15;
    const rightBoundary = screenWidth;
    const bottomBoundary = screenHeight;

    let attempts = 0;
    const maxAttempts = 2000;

    while (newPositions.length < shapesData.length && attempts < maxAttempts) {
      const pos = {
        left: Math.random() * (rightBoundary - leftBoundary) + leftBoundary,
        top: Math.random() * (bottomBoundary - topBoundary) + topBoundary,
      };

      const tooClose = newPositions.some((p) => {
        const dx = p.left - pos.left;
        const dy = p.top - pos.top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });

      if (!tooClose) {
        newPositions.push(pos);
      }

      attempts++;
    }

    if (newPositions.length < shapesData.length) {
      return generatePositions();
    }

    return newPositions;
  };

  useEffect(() => {
    if (isLoggedIn) {
      setPositions(generatePositions());
      const handleResize = () => setPositions(generatePositions());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (gameOver || showCongrats || isPaused) return;

    setTimeLeft(5);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setResult("⏰ Time's up! You Lost!");
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [targetIndex, isPaused]);

  const handleSelect = (shapeName) => {
    if (gameOver || isPaused) return;
    const targetShape = shapesData[targetIndex];

    if (shapeName === targetShape.name) {
      if (targetIndex === shapesData.length - 1) {
        setResult("🏆 Congratulations!");
        setShowCongrats(true);
        setGameOver(true);
      } else {
        setTargetIndex(targetIndex + 1);
      }
    } else {
      setResult("❌ You Lost! Wrong Shape.");
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    clearInterval(timerRef.current);
    setTargetIndex(0);
    setPositions(generatePositions());
    setGameOver(false);
    setResult("");
    setShowCongrats(false);
    setTimeLeft(5);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };

  const handleNextLevel = () => {
    navigate("/game");
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f0f0",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2>🔒 Checking login status...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "15px 25px",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>🎯 Find This Shape</h3>
        {!gameOver ? (
          <>
            <img
              src={shapesData[targetIndex].image}
              alt={shapesData[targetIndex].name}
              style={{ width: "100px", height: "100px" }}
            />
            <h4
              style={{
                marginTop: "10px",
                color: timeLeft <= 2 ? "red" : "#333",
                fontWeight: "bold",
              }}
            >
              ⏱️ Time Left: {timeLeft}s
            </h4>

            <div style={{ marginTop: "15px" }}>
              <button
                onClick={handlePauseResume}
                style={{
                  background: isPaused ? "#4CAF50" : "#FFC107",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 18px",
                  fontSize: "15px",
                  marginRight: "10px",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                }}
              >
                {isPaused ? "▶️ Resume" : "⏸️ Pause"}
              </button>

              <button
                onClick={handleRestart}
                style={{
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 18px",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                }}
              >
                🔁 Restart
              </button>
            </div>
          </>
        ) : (
          <h2>{result}</h2>
        )}
      </div>

      {positions.length > 0 &&
        shapesData.map((shape, i) => (
          <div
            key={shape.name}
            onClick={() => handleSelect(shape.name)}
            style={{
              cursor: isPaused || gameOver ? "not-allowed" : "pointer",
              position: "absolute",
              top: `${positions[i].top}px`,
              left: `${positions[i].left}px`,
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.3)",
              borderRadius: "20px",
              padding: "10px",
              transition: "0.3s",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              pointerEvents: isPaused ? "none" : "auto",
            }}
          >
            <img
              src={shape.image}
              alt={shape.name}
              style={{
                width: "120px",
                height: "120px",
                userSelect: "none",
                opacity: isPaused ? 0.6 : 1,
              }}
            />
          </div>
        ))}

      {gameOver && !showCongrats && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.95)",
            padding: "50px",
            borderRadius: "25px",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          <h2>{result}</h2>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            😢 Try again! Click restart to play again.
          </p>
          <button
            onClick={handleRestart}
            style={{
              marginTop: "20px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 25px",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            🔁 Restart
          </button>
        </div>
      )}

      {showCongrats && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.95)",
            padding: "60px",
            borderRadius: "25px",
            boxShadow: "0 0 25px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "36px", color: "#4CAF50" }}>
            🏆 Congratulations!
          </h1>
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            You found all the shapes correctly! 🎯
          </p>
          <button
            onClick={handleNextLevel}
            style={{
              marginTop: "25px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "12px 30px",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              transition: "0.3s",
            }}
          >
            🚀 Go to Next Level
          </button>
        </div>
      )}
    </div>
  );
}
