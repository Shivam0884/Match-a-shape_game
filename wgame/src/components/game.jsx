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
        onClick={() => navigate("/")}
        alt="Profile"
        style={{
          position: "absolute",
          top: "10px",
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
            top: "70px",
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,0,0,0.7)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
          }
          style={{
            position: "absolute",
            top: "30px",
            right: "50px",
            zIndex: 9999,
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
