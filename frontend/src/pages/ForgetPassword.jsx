import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await API.post(
        `/auth/forgot-password?email=${encodeURIComponent(email)}`
      );

      localStorage.setItem(
        "reset_email",
        email
      );

      navigate("/verify-reset-code");

    } catch (error) {
      console.error(
        "Forgot password error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        "Unable to send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
      <div className="grid-overlay"></div>

      <div className="auth-layout">

        <div className="auth-brand">

          <div className="brand-badge">
            <span className="brand-dot"></span>
            AI-Powered Career Intelligence
          </div>

          <h1>
            Secure your
            <span> account.</span>
          </h1>

          <p>
            We'll send a secure verification code to
            your registered email address so you can
            safely reset your password.
          </p>

        </div>

        <div className="auth-card reset-card">

          <div className="login-header">

            <div className="logo-mark">
              AI
            </div>

            <div>
              <h2>Forgot password?</h2>

              <p>
                Enter your registered email address.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Email address</label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {error && (
              <div className="error-message">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending code...
                </>
              ) : (
                <>
                  Send verification code
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <button
            type="button"
            className="reset-back-button"
            onClick={() =>
              navigate("/login")
            }
          >
            ← Back to login
          </button>

        </div>

      </div>

      <div className="auth-footer">
        © 2026 AI Resume Matcher · AI-powered career intelligence
      </div>

    </div>
  );
}

export default ForgotPassword;