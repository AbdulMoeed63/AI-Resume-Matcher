import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await API.get("/auth/me");

        setUser(response.data);

      } catch (error) {
        console.error("Authentication error:", error);

        localStorage.removeItem("token");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <header className="dashboard-navbar">

        <div className="dashboard-logo">
          <div className="dashboard-logo-mark">
            AI
          </div>

          <span>Resume Matcher</span>
        </div>

        <div className="dashboard-user">

          <div className="user-info">
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="dashboard-content">

        <section className="dashboard-welcome">

          <div>
            <p className="dashboard-label">
              AI CAREER INTELLIGENCE
            </p>

            <h1>
              Welcome back, {user?.name}
            </h1>

            <p>
              Analyze your resume against job opportunities
              and discover how strong your match really is.
            </p>
          </div>

          <button
            className="primary-action"
            onClick={() => navigate("/resume")}
          >
            + New Resume Match
          </button>

        </section>

        <section className="dashboard-grid">

          <div className="dashboard-card">

            <div className="card-icon">
              📄
            </div>

            <h3>Resume Analysis</h3>

            <p>
              Upload your resume and let AI extract your
              skills, education and experience.
            </p>

            <button
              onClick={() => navigate("/resume")}
            >
              Upload Resume →
            </button>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              💼
            </div>

            <h3>Job Description</h3>

            <p>
              Add a job description to compare it against
              your resume.
            </p>

            <button
              onClick={() => navigate("/job")}
            >
              Add Job →
            </button>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              🤖
            </div>

            <h3>AI Match</h3>

            <p>
              Get semantic, skill, education and experience
              compatibility scores.
            </p>

            <button
              onClick={() => navigate("/match")}
            >
              Analyze Match →
            </button>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              📊
            </div>

            <h3>Match History</h3>

            <p>
              Review your previous resume and job
              compatibility results.
            </p>

            <button
              onClick={() => navigate("/history")}
            >
              View History →
            </button>

          </div>

        </section>

        <section className="dashboard-info">

          <div>
            <span>AI ENGINE</span>
            <strong>Sentence Transformers</strong>
          </div>

          <div>
            <span>ANALYSIS</span>
            <strong>Semantic + Skills</strong>
          </div>

          <div>
            <span>SCORING</span>
            <strong>Multi-factor Matching</strong>
          </div>

          <div>
            <span>DATABASE</span>
            <strong>MongoDB Atlas</strong>
          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;