import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const email = localStorage.getItem("reset_email");
  const resetVerified =
    localStorage.getItem("reset_verified");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || resetVerified !== "true") {
      setError(
        "Your password reset session is invalid. Please start again."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await API.post(
        `/auth/reset-password?email=${encodeURIComponent(
          email
        )}&new_password=${encodeURIComponent(
          newPassword
        )}`
      );

      setSuccess(
        "Password reset successfully. Redirecting to login..."
      );

      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_verified");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        "Unable to reset your password. Please try again."
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

        {/* LEFT SIDE */}
        <div className="auth-brand">

          <div className="brand-badge">
            <span className="brand-dot"></span>
            AI-Powered Career Intelligence
          </div>

          <h1>
            Create a
            <span> new password.</span>
          </h1>

          <p>
            Your verification is complete.
            Choose a strong new password to
            secure your AI Resume Matcher account.
          </p>

          <div className="reset-info-list">

            <div className="reset-info-item">
              <div className="reset-info-icon">
                ✓
              </div>

              <div>
                <strong>Email verified</strong>

                <small>
                  Your identity has been successfully
                  verified.
                </small>
              </div>
            </div>

            <div className="reset-info-item">
              <div className="reset-info-icon">
                02
              </div>

              <div>
                <strong>Create your password</strong>

                <small>
                  Use at least 6 characters for your
                  new password.
                </small>
              </div>
            </div>

            <div className="reset-info-item">
              <div className="reset-info-icon">
                03
              </div>

              <div>
                <strong>Sign in again</strong>

                <small>
                  You'll be redirected to the login
                  page after resetting your password.
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* RESET PASSWORD CARD */}
        <div className="auth-card reset-card">

          <div className="login-header">

            <div className="logo-mark">
              AI
            </div>

            <div>
              <h2>New password</h2>

              <p>
                Enter your new account password.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* NEW PASSWORD */}
            <div className="input-group">

              <label>New password</label>

              <div className="input-wrapper">

                <span className="input-icon">
                  *
                </span>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">

              <label>Confirm password</label>

              <div className="input-wrapper">

                <span className="input-icon">
                  *
                </span>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
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

            {success && (
              <div className="reset-success-message">
                <span>✓</span>
                {success}
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
                  Updating password...
                </>
              ) : (
                <>
                  Reset password
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

export default ResetPassword;