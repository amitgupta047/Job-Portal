
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = () => {
    if (user) {
      navigate("/candidate-dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          background: #f8faff;
          color: #172033;
        }

        a {
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        .home-page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(99, 102, 241, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 15%,
              rgba(139, 92, 246, 0.08),
              transparent 25%
            ),
            #f8faff;
        }

        /* =====================================================
           NAVBAR
        ===================================================== */

        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;

          height: 76px;

          background: rgba(255, 255, 255, 0.94);

          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);

          border-bottom: 1px solid #e8eaf2;

          box-shadow:
            0 4px 20px rgba(15, 23, 42, 0.04);
        }

        .navbar-container {
          width: min(92%, 1200px);
          height: 100%;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 25px;
        }

        /* =====================================================
           BRAND
        ===================================================== */

        .brand {
          display: flex;
          align-items: center;

          gap: 11px;

          color: #172033;

          font-size: 21px;
          font-weight: 800;

          flex-shrink: 0;
        }

        .brand-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          color: white;

          font-size: 19px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 8px 20px
            rgba(79, 70, 229, 0.25);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .brand:hover .brand-icon {
          transform:
            translateY(-2px)
            rotate(-3deg);

          box-shadow:
            0 12px 26px
            rgba(79, 70, 229, 0.32);
        }

        /* =====================================================
           NAV LINKS
        ===================================================== */

        .nav-links {
          display: flex;
          align-items: center;

          gap: 34px;

          margin-left: auto;
          margin-right: 30px;
        }

        .nav-links a {
          position: relative;

          color: #596276;

          font-size: 14px;
          font-weight: 650;

          transition:
            color 0.2s ease;
        }

        .nav-links a::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -8px;

          width: 0;
          height: 2px;

          border-radius: 10px;

          background:
            linear-gradient(
              90deg,
              #4f46e5,
              #7c3aed
            );

          transition:
            width 0.25s ease;
        }

        .nav-links a:hover {
          color: #4f46e5;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        /* =====================================================
           NAV ACTIONS
        ===================================================== */

        .nav-actions {
          display: flex;
          align-items: center;

          gap: 9px;

          flex-shrink: 0;
        }

        /* LOGIN */

        .login-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 42px;

          padding:
            9px
            17px;

          color: #4f46e5;

          border:
            1px solid transparent;

          border-radius: 10px;

          font-size: 14px;
          font-weight: 700;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .login-btn:hover {
          background: #eef2ff;

          border-color: #e0e7ff;

          transform:
            translateY(-1px);
        }

        /* REGISTER */

        .register-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 42px;

          padding:
            10px
            20px;

          color: white;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          font-size: 14px;
          font-weight: 750;

          box-shadow:
            0 8px 20px
            rgba(79, 70, 229, 0.22);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .register-btn:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 12px 27px
            rgba(79, 70, 229, 0.30);
        }

        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          position: relative;
          overflow: hidden;

          padding:
            88px
            24px
            90px;

          background:
            radial-gradient(
              circle at 15% 35%,
              rgba(99, 102, 241, 0.13),
              transparent 25%
            ),
            radial-gradient(
              circle at 85% 20%,
              rgba(124, 58, 237, 0.12),
              transparent 25%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f7f8ff 100%
            );
        }

        .hero-container {
          max-width: 1050px;

          margin: auto;

          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;

          gap: 8px;

          padding:
            8px
            14px;

          border:
            1px solid #dddffb;

          border-radius: 30px;

          color: #5148c9;

          background: #f2f3ff;

          font-size: 13px;
          font-weight: 700;

          margin-bottom: 22px;
        }

        .hero-badge span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #6366f1;
        }

        .hero h1 {
          max-width: 850px;

          margin:
            0
            auto;

          font-size:
            clamp(
              42px,
              6vw,
              70px
            );

          line-height: 1.08;

          letter-spacing: -2.8px;

          font-weight: 850;

          color: #172033;
        }

        .hero h1 .gradient-text {
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #9333ea
            );

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          max-width: 650px;

          margin:
            24px
            auto
            36px;

          color: #687286;

          font-size: 17px;

          line-height: 1.7;
        }

        /* =====================================================
           SEARCH
        ===================================================== */

        .search-box {
          max-width: 850px;

          margin: auto;

          padding: 9px;

          display: grid;

          grid-template-columns:
            1fr
            1fr
            auto;

          gap: 8px;

          background: white;

          border:
            1px solid #e3e6f0;

          border-radius: 15px;

          box-shadow:
            0 18px 45px
            rgba(31, 41, 75, 0.10);
        }

        .search-input {
          display: flex;
          align-items: center;

          gap: 11px;

          padding:
            0
            16px;

          min-height: 55px;

          border-radius: 10px;

          background: #f8f9fd;
        }

        .search-icon {
          font-size: 19px;
        }

        .search-input input {
          width: 100%;

          border: none;
          outline: none;

          background: transparent;

          color: #172033;

          font-size: 14px;
        }

        .search-input input::placeholder {
          color: #9299a9;
        }

        .search-button {
          min-width: 145px;

          border: none;

          border-radius: 10px;

          color: white;

          cursor: pointer;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          font-weight: 700;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .search-button:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 8px 20px
            rgba(79, 70, 229, 0.28);
        }

        .hero-actions {
          margin-top: 26px;

          display: flex;

          justify-content: center;

          gap: 12px;
        }

        .browse-btn {
          padding:
            12px
            22px;

          border-radius: 9px;

          color: #4f46e5;

          background: #eef2ff;

          font-size: 14px;

          font-weight: 700;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .browse-btn:hover {
          background: #e3e7ff;

          transform:
            translateY(-1px);
        }

        /* =====================================================
           SECTION
        ===================================================== */

        .section {
          max-width: 1200px;

          margin: auto;

          padding:
            80px
            24px;
        }

        .section-heading {
          text-align: center;

          margin-bottom: 42px;
        }

        .section-heading span {
          color: #6366f1;

          font-size: 13px;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 1.4px;
        }

        .section-heading h2 {
          margin:
            10px
            0;

          color: #172033;

          font-size: 34px;

          letter-spacing: -1px;
        }

        .section-heading p {
          margin: auto;

          max-width: 600px;

          color: #727b8f;

          line-height: 1.6;

          font-size: 15px;
        }

        /* =====================================================
           CATEGORIES
        ===================================================== */

        .categories {
          display: grid;

          grid-template-columns:
            repeat(
              4,
              1fr
            );

          gap: 16px;
        }

        .category-card {
          padding:
            25px
            20px;

          border:
            1px solid #e7e9f2;

          border-radius: 15px;

          background: white;

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;

          cursor: pointer;
        }

        .category-card:hover {
          transform:
            translateY(-5px);

          border-color:
            #cfd2ff;

          box-shadow:
            0 14px 30px
            rgba(46, 50, 100, 0.08);
        }

        .category-icon {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 17px;

          border-radius: 12px;

          background: #eef2ff;

          font-size: 21px;
        }

        .category-card h3 {
          margin:
            0
            0
            7px;

          color: #20283a;

          font-size: 16px;
        }

        .category-card p {
          margin: 0;

          color: #858da0;

          font-size: 13px;
        }

        /* =====================================================
           FEATURES
        ===================================================== */

        .features-section {
          background: white;

          border-top:
            1px solid #edf0f7;

          border-bottom:
            1px solid #edf0f7;
        }

        .features {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              1fr
            );

          gap: 22px;
        }

        .feature-card {
          padding: 30px;

          border:
            1px solid #e8eaf2;

          border-radius: 17px;

          background: #fbfbfe;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .feature-card:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 12px 28px
            rgba(15, 23, 42, 0.06);
        }

        .feature-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 20px;

          border-radius: 14px;

          color: #4f46e5;

          background: #eef2ff;

          font-size: 23px;
        }

        .feature-card h3 {
          margin:
            0
            0
            10px;

          color: #20283a;

          font-size: 18px;
        }

        .feature-card p {
          margin: 0;

          color: #747d90;

          font-size: 14px;

          line-height: 1.7;
        }

        /* =====================================================
           RECRUITER CTA
        ===================================================== */

        .recruiter-section {
          padding:
            80px
            24px;
        }

        .recruiter-card {
          position: relative;

          overflow: hidden;

          max-width: 1152px;

          margin: auto;

          padding:
            55px
            60px;

          border-radius: 24px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #4338ca,
              #7c3aed
            );

          box-shadow:
            0 25px 50px
            rgba(79, 70, 229, 0.20);
        }

        .recruiter-card::after {
          content: "";

          position: absolute;

          width: 280px;
          height: 280px;

          right: -80px;
          top: -110px;

          border-radius: 50%;

          background:
            rgba(255, 255, 255, 0.09);
        }

        .recruiter-content {
          position: relative;

          z-index: 2;

          max-width: 680px;
        }

        .recruiter-card h2 {
          margin:
            0
            0
            14px;

          font-size: 34px;

          letter-spacing: -1px;
        }

        .recruiter-card p {
          margin:
            0
            0
            27px;

          color:
            rgba(
              255,
              255,
              255,
              0.82
            );

          line-height: 1.7;

          font-size: 15px;
        }

        .recruiter-btn {
          display: inline-block;

          padding:
            12px
            21px;

          border-radius: 9px;

          color: #4f46e5;

          background: white;

          font-size: 14px;

          font-weight: 800;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .recruiter-btn:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 8px 20px
            rgba(0, 0, 0, 0.14);
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          border-top:
            1px solid #e5e8f0;

          background: #ffffff;
        }

        .footer-container {
          max-width: 1200px;

          margin: auto;

          padding:
            55px
            24px
            25px;
        }

        .footer-top {
          display: grid;

          grid-template-columns:
            2fr
            1fr
            1fr
            1fr;

          gap: 50px;

          padding-bottom: 45px;
        }

        .footer-brand p {
          max-width: 310px;

          margin-top: 16px;

          color: #7b8496;

          font-size: 14px;

          line-height: 1.7;
        }

        .footer-column h4 {
          margin:
            4px
            0
            17px;

          color: #20283a;

          font-size: 14px;
        }

        .footer-column a {
          display: block;

          margin-bottom: 11px;

          color: #788194;

          font-size: 13px;

          transition:
            color 0.2s ease;
        }

        .footer-column a:hover {
          color: #4f46e5;
        }

        .footer-bottom {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding-top: 22px;

          border-top:
            1px solid #edf0f5;

          color: #9299a8;

          font-size: 12px;
        }

        .footer-bottom-links {
          display: flex;

          gap: 20px;
        }

        .footer-bottom-links a {
          color: #7e8799;
        }

        .footer-bottom-links a:hover {
          color: #4f46e5;
        }

        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        a:focus-visible,
        button:focus-visible,
        input:focus-visible {
          outline:
            3px solid
            rgba(
              99,
              102,
              241,
              0.30
            );

          outline-offset: 3px;
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .nav-links {
            gap: 20px;

            margin-right: 10px;
          }

          .categories {
            grid-template-columns:
              repeat(
                2,
                1fr
              );
          }

          .features {
            grid-template-columns: 1fr;
          }

          .footer-top {
            grid-template-columns:
              1.5fr
              1fr
              1fr;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .navbar {
            height: auto;
          }

          .navbar-container {
            width: 94%;

            padding:
              13px
              0;

            flex-wrap: wrap;

            gap: 13px;
          }

          .brand {
            font-size: 18px;
          }

          .brand-icon {
            width: 37px;
            height: 37px;

            font-size: 17px;
          }

          .nav-actions {
            gap: 5px;
          }

          .login-btn {
            min-height: 38px;

            padding:
              8px
              11px;

            font-size: 12px;
          }

          .register-btn {
            min-height: 38px;

            padding:
              9px
              13px;

            font-size: 12px;
          }

          .nav-links {
            order: 3;

            width: 100%;

            justify-content: center;

            margin:
              0;

            padding-top: 3px;

            gap: 18px;
          }

          .nav-links a {
            font-size: 12px;
          }

          .nav-links a::after {
            bottom: -5px;
          }

          .hero {
            padding:
              65px
              18px
              65px;
          }

          .hero h1 {
            font-size: 42px;

            letter-spacing: -1.8px;
          }

          .hero-description {
            font-size: 15px;
          }

          .search-box {
            grid-template-columns: 1fr;

            padding: 8px;
          }

          .search-button {
            min-height: 52px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .browse-btn {
            text-align: center;
          }

          .section {
            padding:
              60px
              18px;
          }

          .section-heading h2 {
            font-size: 29px;
          }

          .categories {
            grid-template-columns:
              1fr
              1fr;

            gap: 11px;
          }

          .category-card {
            padding:
              20px
              16px;
          }

          .category-card h3 {
            font-size: 14px;
          }

          .category-card p {
            font-size: 12px;
          }

          .recruiter-section {
            padding:
              60px
              18px;
          }

          .recruiter-card {
            padding:
              38px
              25px;

            border-radius: 18px;
          }

          .recruiter-card h2 {
            font-size: 27px;
          }

          .footer-top {
            grid-template-columns:
              1fr
              1fr;

            gap:
              35px
              20px;
          }

          .footer-brand {
            grid-column:
              1 / -1;
          }

          .footer-bottom {
            flex-direction: column;

            align-items: flex-start;

            gap: 14px;
          }
        }

        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 430px) {

          .navbar-container {
            width: 95%;
          }

          .brand {
            font-size: 16px;

            gap: 7px;
          }

          .brand-icon {
            width: 34px;
            height: 34px;

            font-size: 15px;
          }

          .nav-actions {
            gap: 2px;
          }

          .login-btn {
            padding:
              7px
              9px;

            font-size: 11px;
          }

          .register-btn {
            padding:
              8px
              10px;

            font-size: 11px;
          }

          .nav-links {
            gap: 12px;
          }

          .nav-links a {
            font-size: 11px;
          }

          .hero h1 {
            font-size: 36px;
          }

          .categories {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className="navbar"
        aria-label="Main navigation"
      >
        <div className="navbar-container">

          {/* BRAND */}

          <Link
            to="/"
            className="brand"
          >
            <div className="brand-icon">
              💼
            </div>

            <span>
              Job Portal
            </span>
          </Link>

          {/* NAVIGATION */}

          <div className="nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/candidate-dashboard">
              Find Jobs
            </Link>

            <a href="#employers">
              For Employers
            </a>

          </div>

          {/* RIGHT SIDE */}

          <div className="nav-actions">

            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>

          </div>

        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="hero">

          <div className="hero-container">

            <div className="hero-badge">
              <span></span>
              Find opportunities that match your ambition
            </div>

            <h1>
              Find Your Next
              <br />
              <span className="gradient-text">
                Dream Job
              </span>
            </h1>

            <p className="hero-description">
              Discover thousands of opportunities from
              growing startups and leading companies.
              Search, apply, and take the next step in
              your career.
            </p>

            {/* SEARCH */}

            <div className="search-box">

              <div className="search-input">

                <span className="search-icon">
                  🔎
                </span>

                <input
                  type="text"
                  placeholder="Job title, skills or keywords"
                  aria-label="Job title, skills or keywords"
                />

              </div>

              <div className="search-input">

                <span className="search-icon">
                  📍
                </span>

                <input
                  type="text"
                  placeholder="Location"
                  aria-label="Job location"
                />

              </div>

              <button
                className="search-button"
                onClick={handleSearch}
              >
                Search Jobs
              </button>

            </div>

            <div className="hero-actions">

              <Link
                to="/candidate-dashboard"
                className="browse-btn"
              >
                Browse All Jobs →
              </Link>

            </div>

          </div>

        </section>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section className="section">

          <div className="section-heading">

            <span>
              Explore Opportunities
            </span>

            <h2>
              Popular Job Categories
            </h2>

            <p>
              Explore roles across some of the most
              in-demand career fields.
            </p>

          </div>

          <div className="categories">

            <div
              className="category-card"
              onClick={handleSearch}
              role="button"
              tabIndex="0"
            >
              <div className="category-icon">
                💻
              </div>

              <h3>
                Software Development
              </h3>

              <p>
                Frontend, Backend & Full Stack
              </p>
            </div>

            <div
              className="category-card"
              onClick={handleSearch}
              role="button"
              tabIndex="0"
            >
              <div className="category-icon">
                🤖
              </div>

              <h3>
                AI & Machine Learning
              </h3>

              <p>
                AI, ML & Data Science
              </p>
            </div>

            <div
              className="category-card"
              onClick={handleSearch}
              role="button"
              tabIndex="0"
            >
              <div className="category-icon">
                📊
              </div>

              <h3>
                Data & Analytics
              </h3>

              <p>
                Analytics, SQL & BI
              </p>
            </div>

            <div
              className="category-card"
              onClick={handleSearch}
              role="button"
              tabIndex="0"
            >
              <div className="category-icon">
                🎨
              </div>

              <h3>
                Design & Creative
              </h3>

              <p>
                UI/UX, Graphics & Product
              </p>
            </div>

          </div>

        </section>

        {/* =================================================
            FEATURES
        ================================================= */}

        <section className="features-section">

          <div className="section">

            <div className="section-heading">

              <span>
                Why Job Portal
              </span>

              <h2>
                Everything You Need to Get Hired
              </h2>

              <p>
                A simple and modern platform designed
                to make your job search faster and easier.
              </p>

            </div>

            <div className="features">

              <div className="feature-card">

                <div className="feature-icon">
                  🔍
                </div>

                <h3>
                  Find Relevant Jobs
                </h3>

                <p>
                  Search through available opportunities
                  and discover roles that match your skills,
                  experience, and career goals.
                </p>

              </div>

              <div className="feature-card">

                <div className="feature-icon">
                  ⚡
                </div>

                <h3>
                  Apply Easily
                </h3>

                <p>
                  Upload your resume and apply to jobs
                  through a simple, streamlined application
                  process.
                </p>

              </div>

              <div className="feature-card">

                <div className="feature-icon">
                  📈
                </div>

                <h3>
                  Track Applications
                </h3>

                <p>
                  Keep track of your applications and
                  monitor their progress from one convenient
                  dashboard.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            RECRUITER CTA
        ================================================= */}

        <section
          className="recruiter-section"
          id="employers"
        >

          <div className="recruiter-card">

            <div className="recruiter-content">

              <h2>
                Looking for Great Talent?
              </h2>

              <p>
                Build your team with talented candidates.
                Post your job, manage applications, and
                find the right people for your organization.
              </p>

              <button
                className="recruiter-btn"
                onClick={() =>
                  navigate("/register")
                }
                style={{
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Start Hiring →
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-top">

            <div className="footer-brand">

              <Link
                to="/"
                className="brand"
              >
                <div className="brand-icon">
                  💼
                </div>

                <span>
                  Job Portal
                </span>
              </Link>

              <p>
                Connecting talented people with meaningful
                opportunities and helping companies build
                great teams.
              </p>

            </div>

            <div className="footer-column">

              <h4>
                Platform
              </h4>

              <Link to="/">
                Home
              </Link>

              <Link to="/candidate-dashboard">
                Find Jobs
              </Link>

              <a href="#employers">
                For Employers
              </a>

            </div>

            <div className="footer-column">

              <h4>
                For Candidates
              </h4>

              <Link to="/candidate-dashboard">
                Browse Jobs
              </Link>

              <Link to="/my-applications">
                My Applications
              </Link>

            </div>

            <div className="footer-column">

              <h4>
                For Employers
              </h4>

              <a href="#employers">
                Post a Job
              </a>

              <a href="#employers">
                Find Candidates
              </a>

              <a href="#employers">
                Hire Talent
              </a>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 Job Portal. All rights reserved.
            </span>

            <div className="footer-bottom-links">

              <a href="#privacy">
                Privacy
              </a>

              <a href="#terms">
                Terms
              </a>

              <a href="#contact">
                Contact
              </a>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Home;

