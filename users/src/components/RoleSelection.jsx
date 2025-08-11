import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaHome } from "react-icons/fa";
import patientImg from '../images/patient.png';
import doctorImg from '../images/doctor.png';
import '../css/RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  const selectRole = (role) => {
    localStorage.setItem("role", role);
    navigate(role === "patient" ? "/patient/register" : "/doctor/register");
  };

  return (
    <div style={{
      position: "relative",
      padding: "3rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      textAlign: "center"
    }}>
      {/* Home icon */}
      <FaHome
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          fontSize: "1.8rem",
          cursor: "pointer",
          color: "#2c3e50",
          zIndex: 10
        }}
        title="Home"
      />
      {/* Contact Us icon */}
      <FaEnvelope
        onClick={() => navigate("/contact")}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          fontSize: "1.8rem",
          cursor: "pointer",
          color: "#2c3e50",
          zIndex: 10
        }}
        title="Contact Us"
      />

      <h2 style={{
        fontSize: "2.5rem",
        color: "#2c3e50",
        marginBottom: "2rem"
      }}>Select Your Role</h2>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "3rem",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => selectRole("patient")}
          style={{
            background: "linear-gradient(135deg, #2ecc71, #27ae60)",
            border: "none",
            borderRadius: "20px",
            width: "220px",
            height: "220px",
            cursor: "pointer",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            fontWeight: "bold",
            fontSize: "1.6rem",
          }}
        >
          <img src={patientImg} alt="Patient" style={{ width: "90px", height: "90px" }} />
          <span style={{ marginTop: "1rem" }}>Patient</span>
        </button>
        <button
          onClick={() => selectRole("doctor")}
          style={{
            background: "linear-gradient(135deg, #3498db, #2c3e50)",
            border: "none",
            borderRadius: "20px",
            width: "220px",
            height: "220px",
            cursor: "pointer",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            fontWeight: "bold",
            fontSize: "1.6rem",
          }}
        >
          <img src={doctorImg} alt="Doctor" style={{ width: "90px", height: "90px" }} />
          <span style={{ marginTop: "1rem" }}>Doctor</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
