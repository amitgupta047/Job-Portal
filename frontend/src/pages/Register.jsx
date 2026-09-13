
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.role
      );

      console.log("REGISTER SUCCESS:", response);

      setSuccess("Account created successfully! Redirecting...");

      // Redirect according to selected role
      setTimeout(() => {
        if (response.user.role === "recruiter") {
          navigate("/recruiter-dashboard", { replace: true });
        } else {
          navigate("/candidate-dashboard", { replace: true });
        }
      }, 700);
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.18),
              transparent 35%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(124, 58, 237, 0.16),
              transparent 35%
            ),
            #f8fafc;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .register-wrapper {
          width: 100%;
          max-width: 1050px;
          min-height: 680px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          box-shadow:
            0 25px 60px rgba(15, 23, 42, 0.12),
            0 8px 20px rgba(15, 23, 42, 0.05);
        }

        /* ==============================
           LEFT SECTION
        ============================== */

        .register-brand-section {
          position: relative;
          display: flex;
          align-items: center;
          padding: 55px;
          overflow: hidden;
          background: linear-gradient(
            145deg,
            #2563eb 0%,
            #4f46e5 50%,
            #7c3aed 100%
          );
          color: white;
        }

        .register-brand-section::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          top: -110px;
          left: -100px;
        }

        .register-brand-section::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          right: -100px;
          bottom: -90px;
        }

        .brand-content {
          position: relative;
          z-index: 2;
        }

        .brand-logo {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 28px;
          backdrop-filter: blur(10px);
        }

        .brand-title {
          margin: 0 0 16px;
          font-size: 40px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .brand-description {
          max-width: 420px;
          margin: 0 0 35px;
          color: rgba(255, 255, 255, 0.86);
          font-size: 17px;
          line-height: 1.7;
        }

        .brand-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .brand-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 15px;
        }

        .feature-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          font-size: 14px;
        }

        /* ==============================
           RIGHT SECTION
        ============================== */

        .register-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 55px;
          background: #ffffff;
        }

        .register-form-container {
          width: 100%;
          max-width: 400px;
        }

        .register-heading {
          margin: 0 0 8px;
          color: #111827;
          font-size: 31px;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .register-subtitle {
          margin: 0 0 27px;
          color: #6b7280;
          font-size: 15px;
          line-height: 1.5;
        }

        /* ==============================
           ALERTS
        ============================== */

        .register-error,
        .register-success {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
          padding: 13px 14px;
          border-radius: 10px;
          font-size: 14px;
          line-height: 1.5;
        }

        .register-error {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        .register-success {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #15803d;
        }

        .alert-icon {
          font-weight: 800;
          flex-shrink: 0;
        }

        /* ==============================
           FORM
        ============================== */

        .form-group {
          margin-bottom: 17px;
        }

        .form-label {
          display: block;
          margin-bottom: 7px;
          color: #374151;
          font-size: 14px;
          font-weight: 600;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 17px;
          pointer-events: none;
          z-index: 2;
        }

        .register-input,
        .register-select {
          width: 100%;
          height: 48px;
          padding: 0 15px 0 44px;
          border: 1px solid #d1d5db;
          border-radius: 11px;
          outline: none;
          background: #ffffff;
          color: #111827;
          font-size: 15px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .register-input::placeholder {
          color: #9ca3af;
        }

        .register-input:hover,
        .register-select:hover {
          border-color: #9ca3af;
        }

        .register-input:focus,
        .register-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .register-select {
          appearance: none;
          cursor: pointer;
          padding-right: 40px;
        }

        .select-wrapper::after {
          content: "⌄";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-55%);
          color: #6b7280;
          font-size: 18px;
          pointer-events: none;
        }

        .password-input {
          padding-right: 52px;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          padding: 6px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
        }

        .password-toggle:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .password-toggle:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .password-hint {
          margin-top: 6px;
          color: #9ca3af;
          font-size: 12px;
        }

        /* ==============================
           REGISTER BUTTON
        ============================== */

        .register-button {
          width: 100%;
          height: 50px;
          margin-top: 7px;
          border: none;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 8px 18px rgba(37, 99, 235, 0.22);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 12px 25px rgba(37, 99, 235, 0.3);
        }

        .register-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-button:focus-visible {
          outline: 3px solid rgba(37, 99, 235, 0.25);
          outline-offset: 3px;
        }

        .register-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ==============================
           LOGIN LINK
        ============================== */

        .login-section {
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .login-text {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .login-link {
          margin-left: 4px;
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
        }

        .login-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .login-link:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 3px;
          border-radius: 3px;
        }

        /* ==============================
           RESPONSIVE
        ============================== */

        @media (max-width: 850px) {
          .register-wrapper {
            max-width: 500px;
            grid-template-columns: 1fr;
          }

          .register-brand-section {
            padding: 40px;
          }

          .brand-title {
            font-size: 34px;
          }

          .brand-description {
            margin-bottom: 25px;
          }

          .brand-features {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .register-form-section {
            padding: 40px;
          }
        }

        @media (max-width: 520px) {
          .register-page {
            padding: 15px;
            align-items: flex-start;
            padding-top: 25px;
          }

          .register-wrapper {
            border-radius: 18px;
          }

          .register-brand-section {
            padding: 30px 25px;
          }

          .brand-logo {
            width: 50px;
            height: 50px;
            margin-bottom: 20px;
          }

          .brand-title {
            font-size: 29px;
          }

          .brand-description {
            font-size: 15px;
          }

          .brand-features {
            grid-template-columns: 1fr;
            gap: 11px;
          }

          .register-form-section {
            padding: 35px 25px;
          }

          .register-heading {
            font-size: 28px;
          }
        }
      `}</style>

      <main className="register-page">
        <div className="register-wrapper">

          {/* LEFT BRAND SECTION */}

          <section className="register-brand-section">
            <div className="brand-content">

              <div className="brand-logo" aria-hidden="true">
                🚀
              </div>

              <h1 className="brand-title">
                Start Your Journey
              </h1>

              <p className="brand-description">
                Create your account and take the next step
                toward finding the perfect career opportunity.
              </p>

              <div className="brand-features">

                <div className="brand-feature">
                  <span className="feature-icon">✓</span>
                  <span>Build your professional profile</span>
                </div>

                <div className="brand-feature">
                  <span className="feature-icon">✓</span>
                  <span>Explore thousands of opportunities</span>
                </div>

                <div className="brand-feature">
                  <span className="feature-icon">✓</span>
                  <span>Connect with leading recruiters</span>
                </div>

                <div className="brand-feature">
                  <span className="feature-icon">✓</span>
                  <span>Apply for jobs effortlessly</span>
                </div>

              </div>
            </div>
          </section>

          {/* REGISTER FORM */}

          <section className="register-form-section">
            <div className="register-form-container">

              <h2 className="register-heading">
                Create Account
              </h2>

              <p className="register-subtitle">
                Join Job Portal and discover your next opportunity.
              </p>

              {/* ERROR */}

              {error && (
                <div
                  className="register-error"
                  role="alert"
                  aria-live="assertive"
                >
                  <span className="alert-icon">!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div
                  className="register-success"
                  role="status"
                  aria-live="polite"
                >
                  <span className="alert-icon">✓</span>
                  <span>{success}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                aria-busy={loading}
              >

                {/* NAME */}

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="name"
                  >
                    Full name
                  </label>

                  <div className="input-wrapper">
                    <span
                      className="input-icon"
                      aria-hidden="true"
                    >
                      👤
                    </span>

                    <input
                      className="register-input"
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="email"
                  >
                    Email address
                  </label>

                  <div className="input-wrapper">
                    <span
                      className="input-icon"
                      aria-hidden="true"
                    >
                      ✉
                    </span>

                    <input
                      className="register-input"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="password"
                  >
                    Password
                  </label>

                  <div className="input-wrapper">
                    <span
                      className="input-icon"
                      aria-hidden="true"
                    >
                      🔒
                    </span>

                    <input
                      className="register-input password-input"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      aria-required="true"
                      aria-describedby="password-hint"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>

                  <div
                    id="password-hint"
                    className="password-hint"
                  >
                    Password must contain at least 6 characters.
                  </div>
                </div>

                {/* ROLE */}

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="role"
                  >
                    Register as
                  </label>

                  <div className="input-wrapper select-wrapper">
                    <span
                      className="input-icon"
                      aria-hidden="true"
                    >
                      💼
                    </span>

                    <select
                      className="register-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      aria-label="Select account type"
                    >
                      <option value="candidate">
                        Candidate — Looking for jobs
                      </option>

                      <option value="recruiter">
                        Recruiter — Hiring candidates
                      </option>
                    </select>
                  </div>
                </div>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  className="register-button"
                  disabled={loading}
                  aria-busy={loading}
                >
                  <span className="button-content">

                    {loading && (
                      <span
                        className="spinner"
                        aria-hidden="true"
                      />
                    )}

                    {loading
                      ? "Creating Account..."
                      : "Create Account"}

                  </span>
                </button>

              </form>

              {/* LOGIN */}

              <div className="login-section">
                <p className="login-text">
                  Already have an account?

                  <Link
                    to="/login"
                    className="login-link"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>
    </>
  );
};

export default Register;

