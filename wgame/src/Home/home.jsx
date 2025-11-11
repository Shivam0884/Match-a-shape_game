import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/Group 22.png";
import monkey from "../assets/monkey.png";
import bird from "../assets/bird.png";
import { motion } from "framer-motion";

export default function Home() {
  const [isLogIn, setIsLogIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogIn(!!token);
  }, []);

  const handleStartGame = () => {
    if (isLogIn) {
      navigate("/dashboard");
    } else {
      alert("Please login to start the game!");
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.img
        src={monkey}
        alt="monkey"
        initial={{ y: -400, rotate: -20, opacity: 0 }}
        animate={{
          y: 0,
          rotate: [0, -10, 10, -10, 10, 0],
          opacity: 1,
        }}
        transition={{
          y: {
            duration: 2,
            ease: "easeOut",
            type: "spring",
            stiffness: 70,
            damping: 10,
          },
          rotate: {
            delay: 1, // start swinging after falling
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
        }}
        style={{
          position: "absolute",
          top: "0",
          left: "4%",
          width: "160px",
          height: "auto",
          zIndex: 5,
          userSelect: "none",
          transformOrigin: "top center",
        }}
      />

      <motion.img
        src={bird}
        alt="bird"
        initial={{ x: 400, y: -50, opacity: 0, scale: 0.8 }}
        animate={{
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 4,
          delay: 1,
          ease: [0.17, 0.67, 0.83, 0.67],
          type: "spring",
          stiffness: 60,
          damping: 12,
        }}
        style={{
          position: "absolute",
          top: "8%",
          right: "0%",
          width: "280px",
          height: "auto",
          zIndex: 6,
          userSelect: "none",
        }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 80, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 2,
          ease: [0.25, 0.1, 0.25, 1],
          type: "spring",
          stiffness: 60,
          damping: 15,
        }}
        style={{
          fontSize: "clamp(2rem, 7vw, 5rem)",
          fontFamily: "'Luckiest Guy', cursive",
          color: "#000",
          textShadow: "3px 3px #fff",
          marginBottom: "2rem",
          letterSpacing: "2px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 2.5,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block" }}
        >
          Welcome to
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 4,
            delay: 1.2,
            type: "spring",
            stiffness: 70,
            damping: 12,
          }}
          style={{
            color: "#000",
            textDecoration: "underline",
            display: "inline-block",
          }}
        >
          Catch ‘n Match
        </motion.span>
      </motion.h1>

      <button
        onClick={handleStartGame}
        style={{
          background: "linear-gradient(to bottom, #007bff, #0056b3)",
          color: "white",
          padding: "15px 40px",
          borderRadius: "50px",
          fontSize: "1.3rem",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
          boxShadow: "0px 6px 15px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #3399ff, #007bff)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background =
            "linear-gradient(to bottom, #007bff, #0056b3)";
        }}
      >
        Let’s Get Started
      </button>

      {isLogIn ? (
        <p className="mt-3 fs-7 " style={{ fontWeight: "2px", zIndex: 10 }}>
          Now you are ready to play game!
        </p>
      ) : (
        <p
          style={{
            marginTop: "20px",
            fontWeight: "600",
            color: "#333",
            zIndex: 10,
          }}
        >
          Already have an account?{" "}
          <span
            style={{
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      )}
    </div>
  );
}
