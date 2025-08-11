import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/ContactPage.css";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* Link back to Role Selection */}
      <Link
        to="/select-role"
        style={{
          display: "inline-block",
          margin: "24px 0 0 24px",
          padding: "10px 22px",
          background: "#2c3e50",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        &larr; Back to Role Selection
      </Link>

      <h1 className="contact-heading">Contact Page</h1>
      <div className="contact-info-row">
        <div className="contact-info-card">
          <div className="contact-icon">
            <FaEnvelope size={36} />
          </div>
          <div className="contact-info-title">Email Address</div>
          <div className="contact-info-details">
            venkatajayanth.k143@gmail.com<br />
            sasidharpalapala1219@gmail.com
          </div>
        </div>
        <div className="contact-info-card">
          <div className="contact-icon">
            <FaPhone size={36} />
          </div>
          <div className="contact-info-title">Phone Number</div>
          <div className="contact-info-details">
            +91 635356****<br />
            +91 855910****
          </div>
        </div>
        <div className="contact-info-card">
          <div className="contact-icon">
            <FaMapMarkerAlt size={36} />
          </div>
          <div className="contact-info-title">Our Address</div>
          <div className="contact-info-details">
            NIT Warangal,<br />
            Hanmakonda, Warangal,
            Hyderabad,India.
          </div>
        </div>
      </div>

      <div className="contact-center">
        <div className="contact-subtitle">Contact Us</div>
        <h2 className="contact-title">How Can We Help You?</h2>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <div className="contact-form-group">
            <label htmlFor="name">Your Name <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="contact-form-group">
            <label htmlFor="email">Your Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="contact-form-group">
          <label htmlFor="message">Your Message <span className="required">*</span></label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="contact-submit-btn">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
