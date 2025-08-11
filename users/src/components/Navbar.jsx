// src/components/Navbar.jsx
import React from "react";
import '../css/Navbar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { disconnectWallet } from "../utils/wallet";

const Navbar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear role and wallet connection
    localStorage.removeItem("role");
    disconnectWallet();

    // Redirect to appropriate registration page
    if (role === "doctor") {
      navigate("/doctor/register");
    } else if (role === "patient") {
      navigate("/patient/register");
    } else {
      navigate("/select-role");
    }
  };

  // Hide Navbar on pages where it should not appear
  const hideNavbarRoutes = [
    "/",
    "/select-role",
    "/patient/register",
    "/doctor/register"
  ];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  return (
    <nav
      style={{
        padding: "10px",
        backgroundColor: "#1976d2",
        color: "white",
        display: "flex",
        gap: "20px",
        alignItems: "center"
      }}
    >
      {role === "patient" && (
        <>
          <Link to="/patient/dashboard" style={linkStyle(location.pathname === "/patient/dashboard")}>
            Dashboard
          </Link>
          <Link to="/patient/doctors" style={linkStyle(location.pathname === "/patient/doctors")}>
            View Doctors
          </Link>
          <Link to="/patient/reports" style={linkStyle(location.pathname === "/patient/reports")}>
            Send Reports
          </Link>
          <Link to="/patient/prescriptions" style={linkStyle(location.pathname === "/patient/prescriptions")}>
            Prescriptions
          </Link>
        </>
      )}
      {role === "doctor" && (
        <>
          <Link to="/doctor/dashboard" style={linkStyle(location.pathname === "/doctor/dashboard")}>
            Dashboard
          </Link>
          <Link to="/doctor/patients" style={linkStyle(location.pathname === "/doctor/patients")}>
            View Patients
          </Link>
          <Link to="/doctor/precautions" style={linkStyle(location.pathname === "/doctor/precautions")}>
            Send Precautions
          </Link>
          <Link to="/doctor/reports" style={linkStyle(location.pathname === "/doctor/reports")}>
            Reports
          </Link>
        </>
      )}

      {/* Spacer to push logout button to the right */}
      <div style={{ flex: 1 }} />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          background: "#fff",
          color: "#1976d2",
          border: "none",
          borderRadius: "4px",
          padding: "6px 16px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>
    </nav>
  );
};

const linkStyle = (active) => ({
  color: active ? "#ffeb3b" : "white",
  textDecoration: "none",
  fontWeight: active ? "bold" : "normal",
});

export default Navbar;
