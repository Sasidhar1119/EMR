import React, { useState } from "react";
import { FaHome, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getContract } from "../utils/blockchain";
import { connectWallet } from "../utils/wallet";
import Web3 from "web3";
import "../css/DoctorRegistration.css"; // Reuse the same CSS for consistency!
import Dicon from "../images/Dicon.jpg"; // Import your doctor image

const DoctorRegistration = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    specialization: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    experienceYears: "",
    address: "",
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
        .registerDoctor(
          form.firstName,
          form.lastName,
          form.specialization,
          form.email,
          form.phoneNumber,
          form.licenseNumber,
          form.experienceYears,
          form.address,
          form.dateOfBirth
        )
        .send({ from: account });

      setStatus("Registration successful!");
      navigate("/doctor/dashboard");
    } catch (error) {
      setStatus("Registration failed. " + (error.message || ""));
    }
  };

  const handleReset = () => {
    setForm({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      specialization: "",
      email: "",
      phoneNumber: "",
      licenseNumber: "",
      experienceYears: "",
      address: "",
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
        {/* Image box */}
        <div className="image-box smaller-image">
          <img
            src={Dicon}
            alt="Doctor Registration Visual"
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
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleChange}
                required
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
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
            <input
              name="licenseNumber"
              placeholder="Medical License Number"
              value={form.licenseNumber}
              onChange={handleChange}
              required
            />
            <input
              name="experienceYears"
              placeholder="Years of Experience"
              value={form.experienceYears}
              onChange={handleChange}
              required
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <div className="form-actions">
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset All
              </button>
              <button type="submit" className="submit-btn">
                Register Doctor
              </button>
            </div>
            {status && <div className="status-message">{status}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
