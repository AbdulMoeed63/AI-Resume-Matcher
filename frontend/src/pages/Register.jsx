import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-glow register-glow-one"></div>
      <div className="register-glow register-glow-two"></div>

      <div className="register-card">

        <div className="register-header">

          <div className="register-logo">
            AI
          </div>

          <span className="register-badge">
            AI RESUME MATCHER
          </span>

          <h1>
            Create Your Account
          </h1>

          <p>
            Start analyzing your resume with intelligent
            AI-powered job matching.
          </p>

        </div>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <div className="register-field">

            <label htmlFor="register-name">
              Full Name
            </label>

            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>

          <div className="register-field">

            <label htmlFor="register-email">
              Email Address
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <div className="register-field">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span className="register-password-hint">
              Use a strong password to keep your account secure.
            </span>

          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <button
            className="register-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="register-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span className="register-arrow">→</span>
              </>
            )}
          </button>

        </form>

        <div className="register-divider">
          <span>Already registered?</span>
        </div>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;