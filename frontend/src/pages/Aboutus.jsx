import React from "react";
import "./AboutUs.css";

// IMPORT IMAGES
import logo from "../assets/logo.png";
import flowDiagram from "../assets/flowDiagram.png";

const AboutUs = () => {
  return (
    <div className="about-container">

      {/* HEADER */}
      <section className="about-header">
        <img src={logo} alt="yourcase logo" className="about-logo" />
        <p className="tagline">Smart Legal Case Management System</p>
      </section>

      {/* WHO WE ARE */}
      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          yourcase.in is a modern digital platform designed specifically for 
          advocates and legal professionals to efficiently manage their cases, 
          clients, and court schedules in one place.
        </p>
        <p>
          We simplify legal workflows and help lawyers focus more on cases and 
          less on paperwork.
        </p>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <ul>
          <li>Saves time</li>
          <li>Reduces manual work</li>
          <li>Improves case tracking</li>
          <li>Enhances client communication</li>
        </ul>
      </section>

      {/* WHAT WE OFFER */}
      <section className="about-section">
        <h2>What We Offer</h2>

        <div className="features">

          <div className="feature-card">
            <h3>📁 Case Management</h3>
            <p>Add & manage all case details, track status and documents.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Interactive Dashboard</h3>
            <p>View all cases, upcoming hearings and progress.</p>
          </div>

          <div className="feature-card">
            <h3>📅 Court Tracking</h3>
            <p>Never miss hearing dates with proper tracking.</p>
          </div>

          <div className="feature-card">
            <h3>📲 SMS Notifications</h3>
            <p>Get instant alerts for adjournments & updates.</p>
          </div>

          <div className="feature-card">
            <h3>👨‍⚖️ Advocate Friendly</h3>
            <p>Simple and easy-to-use interface for lawyers.</p>
          </div>

        </div>
      </section>

      {/* 🔥 SYSTEM FLOW DIAGRAM */}
      <section className="about-section">
        <h2>System Flow</h2>

        <img
          src={flowDiagram}
          alt="yourcase system flow diagram"
          className="flow-diagram"
        />
      </section>

      {/* WHY CHOOSE US */}
      <section className="about-section">
        <h2>Why Choose Us</h2>
        <ul>
          <li>✔ Saves valuable time</li>
          <li>✔ Reduces paperwork</li>
          <li>✔ Improves organization</li>
          <li>✔ Ensures timely updates</li>
          <li>✔ Accessible anywhere</li>
        </ul>
      </section>

      {/* VISION */}
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          To become India’s most trusted digital platform for legal professionals 
          by bringing innovation and simplicity into the legal ecosystem.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <p>yourcase.in – Digitizing Legal Practice</p>
      </footer>

    </div>
  );
};

export default AboutUs;