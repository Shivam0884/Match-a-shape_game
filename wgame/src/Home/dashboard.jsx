import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/Avatar.png";
import bgImage from "../assets/home.png";
import level2 from "../assets/l1.png";
import level1 from "../assets/l2.png";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLogIn, setIsLogIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("loggedInUser");
    if (token && user) {
      setIsLogIn(true);
      setUserName(user);
    }
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
      className="d-flex flex-column justify-content-between align-items-center text-center"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
      {/*  Logout Button */}
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
            top: "46px",
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

      {/* Game Title */}
      <h1
        className="fw-bold text-light mt-5"
        style={{
          fontSize: "60px",
          fontFamily: "'Comic Sans MS', 'Fredoka One', cursive",
          textShadow: "3px 3px 8px rgba(0,0,0,0.6)",
          letterSpacing: "2px",
          backgroundColor: "#000",
          padding: "15px 50px",
          borderRadius: "20px",
          display: "inline-block",
          boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
        }}
      >
        Match’n Catch
      </h1>

      <div style={{ flexGrow: 1 }}></div>

      {/* Level Images */}
      <div
        className="container mb-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "80px",
        }}
      >
        <img
          src={level1}
          alt="Level 1"
          onClick={() => navigate("/about1")}
          style={{
            width: "380px",
            height: "260px",
            objectFit: "contain",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <img
          src={level2}
          alt="Level 2"
          onClick={() => navigate("/about2")}
          style={{
            width: "380px",
            height: "260px",
            objectFit: "contain",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    </div>
  );
}
