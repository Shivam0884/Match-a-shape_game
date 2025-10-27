import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); //The !! (double bang) converts any value into a boolean.
  }, []);

  // Handle Logout
  const handleLogout = () => {
    // Remove JWT token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    // Update login state
    setIsLoggedIn(false);

    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4"
      style={{
        background: "linear-gradient(to bottom, #2c3e50, #34495e)",
        minHeight: "70px",
      }}
    >
      {/* Brand */}
      <Link className="navbar-brand fw-bold text-light" to="/">
        HOME
      </Link>

      {/* Mobile Toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar Links */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {/* About always visible */}
          <li className="nav-item">
            <Link
              className="nav-link text-light fw-semibold"
              to="/about"
              style={{ transition: "0.3s" }}
            >
              About
            </Link>
          </li>

          {/* Conditional Rendering */}
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-link nav-link text-light fw-semibold"
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link text-light fw-semibold"
                  to="/signup"
                  style={{ transition: "0.3s" }}
                >
                  Signup
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-light fw-semibold"
                  to="/login"
                  style={{ transition: "0.3s" }}
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Custom Styling */}
      <style>
        {`
          .nav-link:hover {
            color: #f39c12 !important; /* golden hover */
          }

          @media (max-width: 992px) {
            .navbar-nav {
              text-align: center;
              padding: 1rem 0;
            }
            .nav-link {
              padding: 10px 0;
              font-size: 1.1rem;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
