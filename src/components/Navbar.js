import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [showOptions, setShowOptions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      <h2 className="logo" onClick={() => navigate("/")}>
        NeuroScan AI
      </h2>

      <div className="nav-buttons">
        <button className="nav-btn" onClick={() => navigate("/")}>
          Home
        </button>

        <button className="nav-btn" onClick={() => navigate("/study")}>
          Study
        </button>

        <div className="login-container" ref={dropdownRef}>
          <button
            className="nav-btn login-btn"
            onClick={() => setShowOptions(!showOptions)}
          >
            Login
          </button>

          {showOptions && (
            <div className="login-dropdown">
              <button onClick={() => {
                navigate("/admin-login");
                setShowOptions(false);
              }}>
                🛠 Admin
              </button>

              <button onClick={() => {
                navigate("/doctor-login");
                setShowOptions(false);
              }}>
                👨‍⚕️ Doctor
              </button>
            </div>
          )}
        </div>

        <button className="nav-btn" onClick={() => navigate("/about")}>
          About
        </button>
      </div>
    </nav>
  );
}

export default Navbar;