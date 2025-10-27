import React, { useEffect, useState } from "react";
import bgImage from "../assets/Desktop - 5.png";
import profile from "../assets/Avatar.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const [userName, setUserName] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("loggedInUser");
    if (name) setUserName(name);
    const token = localStorage.getItem("token");
    setIsLogIn(!!token);
  }, []);

  const handleClick = () => {
    if (isLogIn) {
      navigate("/api/game");
    } else {
      alert("Please login to start the game!");
      navigate("/login");
    }
  };
  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsLogIn(false);
    setUserName("");
    navigate("/login");
  };
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background */}
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* ✅ Logout Section (Top Right) */}
      {isLogIn && (
        <div
          className="position-fixed d-flex align-items-center gap-2 text-white fw-bold"
          style={{
            top: "25px",
            right: "50px",
            zIndex: 15,
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "10px 18px",
            borderRadius: "30px",
            transition: "background 0.3s",
          }}
          onClick={handleLogout}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,0,0,0.7)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
          }
        >
          <p className="m-0 fs-5">Logout</p>
          <i
            className="fa fa-sign-out fs-4"
            aria-hidden="true"
            style={{ marginLeft: "5px" }}
          ></i>
        </div>
      )}
      {/* Profile Section */}
      <div
        className="d-flex flex-column align-items-center position-fixed"
        style={{ top: "20px", left: "60px", zIndex: 10 }}
      >
        <img
          src={profile}
          alt="Profile"
          className="rounded-circle border border-white shadow"
          style={{ width: "60px", height: "60px", cursor: "pointer" }}
        />
        {userName && (
          <h3 className="mt-2 text-dark fw-bold text-center">{userName}</h3>
        )}
      </div>
      {/* Center Box */}
      <div
        className="position-fixed bg-light rounded shadow p-4 text-center"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "620px",
          zIndex: 5,
        }}
      >
        <h2
          className="text-danger mb-4 fw-bold"
          style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: "2.5rem" }}
        >
          🎮 How to Play Level 1! 🎨
        </h2>
        <div className="mb-4 text-start" style={{ paddingLeft: "30px" }}>
          <p className="mb-2 fs-4">1️⃣ Look at the picture on the left side.</p>
          <p className="mb-2 fs-4">
            2️⃣ Find the matching shape from the options on the right.
          </p>
          <p className="mb-2 fs-4">3️⃣ Click the shape you think is correct.</p>
          <p className="mb-2 fs-4">
            4️⃣ Yay! If you’re correct, you win points and move on.
          </p>
          <p className="mb-2 fs-4">
            5️⃣ Oops! Wrong one? Try again until you get it right.
          </p>
        </div>
        <p className="text-success fs-4 fw-bold">
          🎯 Goal: Match all shapes & complete Level 1! 🎯
        </p>
        <button
          className="fw-bold"
          onClick={handleClick}
          style={{
            background: "linear-gradient(45deg, #ff6ec4, #7873f5)",
            color: "white",
            fontSize: "1.8rem",
            padding: "15px 40px",
            border: "none",
            borderRadius: "20px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            fontFamily: "'Comic Sans MS', cursive",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
          }}
        >
          🚀 Start
        </button>
      </div>
    </div>
  );
}
