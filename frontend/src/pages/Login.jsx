import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");

    } catch (error) {
      console.log("Login error:", error.response?.data);

      setError(
        error.response?.data?.detail ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background decoration */}
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
            Find the right
            <span> opportunity.</span>
          </h1>

          <p>
            Analyze your resume against real job requirements
            using semantic AI, skill matching, education and
            experience analysis.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div>
                <strong>AI Resume Analysis</strong>
                <small>
                  Understand how well your resume matches a job.
                </small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Smart Skill Matching</strong>
                <small>
                  Identify your strengths and missing skills.
                </small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">◈</div>
              <div>
                <strong>Explainable Results</strong>
                <small>
                  See exactly why your resume received its score.
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* LOGIN CARD */}
        <div className="auth-card">

          <div className="login-header">
            <div className="logo-mark">
              AI
            </div>

            <div>
              <h2>Welcome back</h2>
              <p>Sign in to continue to your dashboard.</p>
            </div>
          </div>

          <form onSubmit={handleLogin}>

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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

            </div>

            <div className="input-group">

              <div className="password-label">
                <label>Password</label>

                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => alert("Password reset will be added soon.")}
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">

                <span className="input-icon">
                  •••
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  {showPassword ? "◉" : "◌"}
                </button>

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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-button"
            onClick={() =>
              alert("Google authentication will be connected soon.")
            }
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>

          <div className="security-note">
            <span>🔒</span>
            Your data is securely processed and protected.
          </div>

        </div>

      </div>

      <div className="auth-footer">
        © 2026 AI Resume Matcher · AI-powered career intelligence
      </div>

    </div>
  );
}

export default Login;