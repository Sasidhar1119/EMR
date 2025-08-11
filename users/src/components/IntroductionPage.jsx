import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import logo from "../images/logo.png";
import bgImage from "../images/background.png";

const IntroductionPage = () => {
  const navigate = useNavigate();

  const proceed = () => navigate("/select-role");
  const goContact = () => navigate("/contact");

  // Overlay opacity (0 to 1)
  const overlayOpacity = 0.7;

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Background image */}
      <img
        src={bgImage}
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: 0,
          margin: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          zIndex: 0,
        }}
      />

      {/* Black overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          zIndex: 1,
        }}
      />

      {/* Contact icon */}
      <button
        onClick={goContact}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          color: "white",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "1.8rem",
          zIndex: 10,
          padding: 0,
          pointerEvents: "auto",
        }}
        title="Contact Us"
        aria-label="Contact Us"
      >
        <FaEnvelope />
      </button>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <img src={logo} alt="EMR Logo" style={{ width: 150, marginBottom: 20 }} />
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: 20 }}>
          Electronic Medical Records (EMR) System
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: 20 }}>
          Your secure blockchain-based medical record system.
        </p>
        <button
          onClick={proceed}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default IntroductionPage;
