import React, { useState } from "react";
import { FaHome, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getContract } from "../utils/blockchain";
import { connectWallet } from "../utils/wallet";
import Web3 from "web3";
import "../css/PatientRegistration.css";
import Picon from "../images/Picon.png"; // Import your local image

const PatientRegistration = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    gender: "",
    patientAddress: "",
    phoneNumber: "",
    bloodGroup: "",
    insuranceProvider: "",
    policyNumber: "",
  });

  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      const { web3, account } = await connectWallet();
      setAccount(account);
      setStatus("Wallet connected: " + account);
    } catch (err) {
      setStatus("Failed to connect wallet: " + (err.message || err));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      setStatus("Connect your wallet first!");
      return;
    }
    setStatus("Submitting transaction...");
    try {
      const web3 = new Web3(window.ethereum);
      const contract = await getContract(web3);
      await contract.methods
        .registerPatient(
          form.firstName,
          form.lastName,
          form.dateOfBirth,
          form.email,
          form.gender,
          form.patientAddress,
          form.phoneNumber,
          form.bloodGroup,
          form.insuranceProvider,
          form.policyNumber
        )
        .send({ from: account });
      setStatus("Registration successful!");
      navigate("/patient/dashboard");
    } catch (error) {
      setStatus("Registration failed. " + (error.message || ""));
    }
  };

  const handleReset = () => {
    setForm({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      gender: "",
      patientAddress: "",
      phoneNumber: "",
      bloodGroup: "",
      insuranceProvider: "",
      policyNumber: "",
    });
    setStatus("");
  };

  return (
    <div className="registration-page">
      <div className="sidebar-icons">
        <a href="/" title="Home" className="icon-link">
          <FaHome size={28} />
          <span>Home</span>
        </a>
        <a href="/contact" title="Contact Us" className="icon-link">
          <FaEnvelope size={28} />
          <span>Contact Us</span>
        </a>
      </div>

      <div className="registration-container">
        {/* Image box smaller now */}
        <div className="image-box smaller-image">
          <img
            src={Picon}
            alt="Registration Visual"
            className="registration-image"
          />
        </div>

        {/* Form box */}
        <div className="form-box">
          <div className="form-header">
            <button
              className="connect-wallet-btn"
              onClick={handleConnectWallet}
              disabled={!!account}
            >
              {account ? "Wallet Connected" : "Connect MetaMask Wallet"}
            </button>
            {account && <span className="account-info">{account}</span>}
          </div>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <input
              name="patientAddress"
              placeholder="Address"
              value={form.patientAddress}
              onChange={handleChange}
              required
            />
            <div className="form-row gender-row">
              <label>Gender:</label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                  required
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                  required
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={form.gender === "Other"}
                  onChange={handleChange}
                  required
                />
                Other
              </label>
            </div>
            <div className="form-row">
              <input
                name="dateOfBirth"
                type="date"
                placeholder="Date of Birth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <input
              name="bloodGroup"
              placeholder="Blood Group"
              value={form.bloodGroup}
              onChange={handleChange}
              required
            />
            <input
              name="insuranceProvider"
              placeholder="Insurance Provider"
              value={form.insuranceProvider}
              onChange={handleChange}
            />
            <input
              name="policyNumber"
              placeholder="Policy Number"
              value={form.policyNumber}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="form-actions">
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset All
              </button>
              <button type="submit" className="submit-btn">
                Register Patient
              </button>
            </div>
            {status && <div className="status-message">{status}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
