import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyResetCode() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const email = localStorage.getItem("reset_email");

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Your reset session has expired. Please request a new code."
      );
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await API.post(
        `/auth/verify-reset-code?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(code)}`
      );

      setSuccess(
        "Code verified successfully."
      );

      localStorage.setItem(
        "reset_verified",
        "true"
      );

      setTimeout(() => {
        navigate("/reset-password");
      }, 700);

    } catch (error) {
      console.error(
        "Verification error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Your reset session has expired. Please start again."
      );
      return;
    }

    setResending(true);

    try {
      await API.post(
        `/auth/forgot-password?email=${encodeURIComponent(
          email
        )}`
      );

      setSuccess(
        "A new verification code has been sent to your email."
      );

    } catch (error) {
      console.error(
        "Resend error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
        "Unable to resend the code."
      );
    } finally {
      setResending(false);
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
            Verify your
            <span> identity.</span>
          </h1>

          <p>
            We've sent a secure verification code to
            your registered email address.
          </p>

          <div className="reset-info-list">

            <div className="reset-info-item">
              <div className="reset-info-icon">
                01
              </div>

              <div>
                <strong>Check your email</strong>

                <small>
                  Look for the AI Resume Matcher
                  password reset email.
                </small>
              </div>
            </div>

            <div className="reset-info-item">
              <div className="reset-info-icon">
                02
              </div>

              <div>
                <strong>Enter the code</strong>

                <small>
                  Use the 6-digit code from the email.
                </small>
              </div>
            </div>

            <div className="reset-info-item">
              <div className="reset-info-icon">
                03
              </div>

              <div>
                <strong>Create a new password</strong>

                <small>
                  Set a secure password for your account.
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* VERIFICATION CARD */}
        <div className="auth-card reset-card">

          <div className="login-header">

            <div className="logo-mark">
              AI
            </div>

            <div>
              <h2>Verify code</h2>

              <p>
                Enter the 6-digit code sent to your email.
              </p>
            </div>

          </div>

          <form onSubmit={handleVerify}>

            <div className="input-group">

              <label>Verification code</label>

              <div className="input-wrapper">

                <span className="input-icon">
                  #
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setCode(value);
                  }}
                  required
                />

              </div>

              <small className="reset-email-display">
                Code sent to{" "}
                <strong>
                  {email || "your email"}
                </strong>
              </small>

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
                  Verifying...
                </>
              ) : (
                <>
                  Verify code
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <button
            type="button"
            className="reset-resend-button"
            onClick={handleResend}
            disabled={resending}
          >
            {resending
              ? "Sending..."
              : "Didn't receive the code? Resend"}
          </button>

          <button
            type="button"
            className="reset-back-button"
            onClick={() =>
              navigate("/forgot-password")
            }
          >
            ← Change email
          </button>

        </div>

      </div>

      <div className="auth-footer">
        © 2026 AI Resume Matcher · AI-powered career intelligence
      </div>

    </div>
  );
}

export default VerifyResetCode;