import React, { useEffect, useState } from "react";
import "../css/PatientDashboard.css";
import { getWeb3, getContract } from "../utils/blockchain";
import Navbar from "./Navbar";
import patientImg from "../images/patient1.png";

function PatientDashboard() {
  const [, setAccount] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatient() {
      try {
        const web3 = await getWeb3();
        if (!web3) throw new Error("Please install MetaMask.");
        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) throw new Error("Please connect MetaMask wallet.");
        setAccount(accounts[0]);

        const contract = await getContract(web3);
        const details = await contract.methods.patients(accounts[0]).call();
        if (!details.isRegistered) throw new Error("You are not registered as a patient.");
        setPatient(details);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load patient details.");
        setLoading(false);
      }
    }
    loadPatient();
  }, []);

  if (loading) return <div className="patient-loading">Loading patient dashboard...</div>;
  if (error) return <div className="patient-error">{error}</div>;

  return (
    <>
      <Navbar role="patient" />
      <div className="patient-dashboard-bg">
        <div className="patient-dashboard-card">
          <div className="patient-dashboard-image-wrap">
            <img src={patientImg} alt="Patient" className="patient-dashboard-image" />
          </div>
          <h2 className="patient-dashboard-welcome">
            Welcome, <span>{patient.firstName} {patient.lastName}</span>
          </h2>
          <div className="patient-dashboard-info-grid">
            <div className="info-card"><strong>Date of Birth:</strong> {patient.dateOfBirth}</div>
            <div className="info-card"><strong>Email:</strong> {patient.email}</div>
            <div className="info-card"><strong>Gender:</strong> {patient.gender}</div>
            <div className="info-card"><strong>Address:</strong> {patient.patientAddress}</div>
            <div className="info-card"><strong>Phone:</strong> {patient.phoneNumber}</div>
            <div className="info-card"><strong>Blood Group:</strong> {patient.bloodGroup}</div>
            <div className="info-card"><strong>Insurance:</strong> {patient.insuranceProvider}</div>
            <div className="info-card"><strong>Policy Number:</strong> {patient.policyNumber}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientDashboard;
