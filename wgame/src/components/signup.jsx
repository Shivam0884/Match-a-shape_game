import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../util";
import bgImage from "../assets/signup.png"; // same background as login

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("⚠️ Please fill all fields!");
    }
    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details);
      } else {
        handleError(message);
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
      {/* signup box */}
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
          Sign Up
        </h1>

        <p
          style={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          Create your account to get started!
        </p>

        <form onSubmit={handleSignup}>
          {/* Name */}
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={signupInfo.name}
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

          {/* Email */}
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
              value={signupInfo.email}
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

          {/* Password with eye toggle */}
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
              value={signupInfo.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.7rem 2.5rem 0.7rem 0.7rem",
                borderRadius: "6px",
                border: "none",
                outline: "none",
                fontSize: "1rem",
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "60%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.1rem",
                userSelect: "none",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Submit button */}
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
            Sign Up
          </button>
        </form>

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

        <p style={{ marginTop: "1.2rem", fontWeight: "bold" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#000" }}>
            Login
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
