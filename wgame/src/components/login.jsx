import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../assets/grp.png"; // keep your jungle background

export default function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // 👁️ added state
  const navigate = useNavigate();

  const handleError = (msg) => toast.error(msg);
  const handleSuccess = (msg) => toast.success(msg);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("⚠️ Please fill all fields!");
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => navigate("/"), 1000);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (err) {
      handleError("Server error!");
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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* login box */}
      <div
        style={{
          background: "linear-gradient(to bottom, #6cd9b3, #117b83)",
          padding: "2.5rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
          fontFamily: "'Comic Sans MS', sans-serif",
          color: "#000",
        }}
      >
        <h1
          style={{
            fontWeight: "900",
            textTransform: "uppercase",
            fontSize: "1.8rem",
            marginBottom: "0.7rem",
          }}
        >
          Login
        </h1>

        <p
          style={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          Please enter your email and password.
        </p>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <label
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "0.85rem",
                marginBottom: "0.4rem",
                display: "block",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: "6px",
                border: "none",
                outline: "none",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div
            style={{
              textAlign: "left",
              marginBottom: "1rem",
              position: "relative",
            }}
          >
            <label
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "0.85rem",
                marginBottom: "0.4rem",
                display: "block",
              }}
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.7rem 2.5rem 0.7rem 0.7rem", // space for icon
                borderRadius: "6px",
                border: "none",
                outline: "none",
                fontSize: "1rem",
              }}
            />

            {/* 👁️ Toggle Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "65%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.1rem",
                userSelect: "none",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              border: "none",
              borderRadius: "6px",
              padding: "0.8rem",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {/* OR Divider */}
        <div
          style={{
            margin: "1.5rem 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <hr style={{ flex: 1, border: "1px solid #000" }} />
          <span style={{ margin: "0 10px", fontWeight: "bold" }}>OR</span>
          <hr style={{ flex: 1, border: "1px solid #000" }} />
        </div>

        {/* Sign Up Link */}
        <p style={{ marginTop: "1.2rem", fontWeight: "bold" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#000" }}>
            Sign Up
          </Link>
          &nbsp; OR &nbsp;
          <Link to="/" style={{ color: "#000" }}>
            Home
          </Link>
        </p>

        <ToastContainer />
      </div>
    </div>
  );
}
