import React, { useEffect, useState } from "react";
import bgImage from "../assets/Desktop - 5.png";
import profile from "../assets/Avatar.png";
import { useNavigate } from "react-router-dom";
import ShapeGame from "../components/shapeGame";

export default function Game() {
  const [userName, setUserName] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");
    if (name) setUserName(name);
    setIsLogIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsLogIn(false);
    setUserName("");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Profile */}
      <img
        src={profile}
        alt="Profile"
        style={{
          position: "absolute",
          top: "20px",
          left: "60px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "2px solid white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        }}
      />

      {userName && (
        <h3
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            color: "#000",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          {userName}
        </h3>
      )}

      {isLogIn && (
        <div
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "30px",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <span>Logout</span>
          <i className="fa fa-sign-out fs-4" aria-hidden="true"></i>
        </div>
      )}

      {/* Game Section */}
      <ShapeGame userName={userName} />
    </div>
  );
}
