import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/Group 22.png"; // ✅ Replace with your image path (use your uploaded image)

export default function Home() {
  const [isLogIn, setIsLogIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogIn(!!token);
  }, []);

  const handleStartGame = () => {
    if (isLogIn) {
      navigate("/about");
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
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "clamp(2rem, 7vw, 5rem)",
          fontFamily: "'Luckiest Guy', cursive",
          color: "#000",
          textShadow: "3px 3px #fff",
          marginBottom: "2rem",
          letterSpacing: "2px",
        }}
      >
        Welcome to <br />
        <span style={{ color: "#000", textDecoration: "underline" }}>
          Word Catcher
        </span>
      </h1>
      {/* Start Button */}
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
      {/* Sign In Text */}
      {isLogIn ? (
        <p className="mt-3 fs-7 " style={{ fontWeight: "2px" }}>
          Now you are ready to play game!
        </p>
      ) : (
        <p
          style={{
            marginTop: "20px",
            fontWeight: "600",
            color: "#333",
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
