import React, { useEffect, useState } from "react";
import "../css/DoctorDashboard.css";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";
import doctorImg from "../images/patient1.png"; // Use your doctor image

function DoctorDashboard() {
  const [, setAccount] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctor() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");
        setAccount(accounts[0]);

        const contract = await getContract(web3);
        const details = await contract.methods.doctors(accounts[0]).call();
        if (!details.isRegistered) throw new Error("You are not registered as a doctor.");
        setDoctor(details);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load doctor details.");
        setLoading(false);
      }
    }
    loadDoctor();
  }, []);

  if (loading) return <div className="doctor-loading">Loading doctor dashboard...</div>;
  if (error) return <div className="doctor-error">{error}</div>;

  return (
    <>
      <Navbar role="doctor" />
      <div className="doctor-dashboard-bg">
        <div className="doctor-dashboard-card">
          <div className="doctor-dashboard-image-wrap">
            <img src={doctorImg} alt="Doctor" className="doctor-dashboard-image" />
          </div>
          <h2 className="doctor-dashboard-welcome">
            Welcome, Dr. <span>{doctor.firstName} {doctor.lastName}</span>
          </h2>
          <div className="doctor-dashboard-info-grid">
            <div className="info-card"><strong>Specialization:</strong> {doctor.specialization}</div>
            <div className="info-card"><strong>Email:</strong> {doctor.email}</div>
            <div className="info-card"><strong>Phone:</strong> {doctor.phoneNumber}</div>
            <div className="info-card"><strong>Clinic Address:</strong> {doctor.YearsExperience} </div>
            <div className="info-card"><strong>Years of Experience:</strong> {doctor.Doctoraddress} </div>
            <div className="info-card"><strong>Medical License Number:</strong> {doctor.licensenumber} </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;
