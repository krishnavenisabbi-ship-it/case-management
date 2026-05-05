import React from "react";
import "./Home.css";
import heroImage from "../assets/poster.png"; // your poster image

const Home = () => {
  return (
    <div className="home">
	 {/* 🔥 TAILWIND TEST */}
      <div className="bg-red-500 text-white p-5 text-center">
        TAILWIND TEST
      </div>

      {/* HERO SECTION */}
      <section className="hero pt-[90px] px-4">
        <div className="hero-left">
          <h1>
            Manage Every Case.<br />
            <span>Never Miss a Date.</span>
          </h1>

          <p>
            YourCase.in is a smart legal case management system designed to help
            advocates manage cases, clients, and hearings efficiently. Stay organized,
            track progress, and receive timely SMS alerts for adjournment dates.
          </p>

          <button className="cta-btn">Get Started</button>
        </div>

        <div className="hero-right">
          <img src={heroImage} alt="Case Management System" />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about">
        <h2>What is YourCase.in?</h2>
        <p>
          YourCase.in is a powerful and user-friendly case management platform
          built for advocates and legal professionals. It centralizes all case
          details, client information, and court schedules into one easy-to-use system.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Key Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📁 Case Management</h3>
            <p>Add, update, and track all case details in one place.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Dashboard</h3>
            <p>View case summary, upcoming hearings, and status instantly.</p>
          </div>

          <div className="feature-card">
            <h3>📅 Hearing Updates</h3>
            <p>Track adjournments and hearing dates easily.</p>
          </div>

          <div className="feature-card">
            <h3>📩 SMS Alerts</h3>
            <p>Get automatic notifications for important case updates.</p>
          </div>

          <div className="feature-card">
            <h3>📄 Document Storage</h3>
            <p>Upload and manage all case-related documents securely.</p>
          </div>

          <div className="feature-card">
            <h3>🔔 Reminders</h3>
            <p>Never miss deadlines with smart reminders and alerts.</p>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits">
        <h2>Benefits for Advocates</h2>

        <ul>
          <li>✔ Saves time and reduces manual paperwork</li>
          <li>✔ Improves organization and case tracking</li>
          <li>✔ Ensures timely updates and reminders</li>
          <li>✔ Enhances client communication</li>
          <li>✔ Accessible anytime, anywhere</li>
        </ul>
      </section>

      {/* CTA SECTION */}
      <section className="cta">
        <h2>Start Managing Your Cases Smarter</h2>
        <p>Join YourCase.in today and simplify your legal workflow.</p>
        <button className="cta-btn">Get Started</button>
      </section>

    </div>
  );
};

export default Home;