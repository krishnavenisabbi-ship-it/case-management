import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";
import poster from "../assets/poster.png";   // make sure file exists

const Home = () => {
  return (
    <>
    
      <div className="home">

        {/* HERO SECTION */}
        <section className="hero">

          {/* LEFT SIDE */}
          <div className="hero-left">
            <h1>Manage Every Case. Never Miss a Date.</h1>

            <p>
              YourCase.in is a smart case management system designed for
              advocates to manage cases, clients, and hearings efficiently.
              Get SMS alerts on adjournment dates and stay organized.
            </p>

            <button className="cta-btn">Get Started</button>
          </div>

          {/* RIGHT SIDE (POSTER IMAGE) */}
          <div className="hero-right">
            <img src={poster} alt="poster" />
          </div>

        </section>

        {/* FEATURES SECTION */}
        <section className="features">

          <div className="feature-card">
            <h3>Case Management</h3>
            <p>Store and manage all case details in one place.</p>
          </div>

          <div className="feature-card">
            <h3>Interactive Dashboard</h3>
            <p>Track all your cases, hearings, and updates easily.</p>
          </div>

          <div className="feature-card">
            <h3>SMS Alerts</h3>
            <p>Get instant notifications on adjournment dates.</p>
          </div>

        </section>

      </div>

      <Footer />
    </>
  );
};

export default Home;