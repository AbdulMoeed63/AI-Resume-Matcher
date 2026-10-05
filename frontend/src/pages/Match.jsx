import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Match() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const runMatch = async () => {
      const resumeId = localStorage.getItem("resume_id");
      const jobId = localStorage.getItem("job_id");

      if (!resumeId || !jobId) {
        setError(
          "Resume or job information is missing. Please complete the previous steps."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await API.post(
          `/match/?resume_id=${resumeId}&job_id=${jobId}`
        );

        setResult(response.data);

      } catch (error) {
        console.error(
          "Matching error:",
          error
        );

        setError(
          error.response?.data?.detail ||
          "Failed to analyze resume compatibility."
        );

      } finally {
        setLoading(false);
      }
    };

    runMatch();
  }, []);

  const handleNewAnalysis = () => {
    localStorage.removeItem("resume_id");
    localStorage.removeItem("job_id");

    navigate("/resume");
  };

  if (loading) {
    return (
      <div className="match-page">

        <div className="match-loading-container">

          <div className="match-loading-glow"></div>

          <div className="match-loading-icon">
            AI
          </div>

          <p className="match-loading-label">
            AI CAREER INTELLIGENCE
          </p>

          <h1>
            Analyzing Your Compatibility
          </h1>

          <p className="match-loading-description">
            Our AI is comparing your resume with the
            job requirements using semantic similarity,
            skills, education and experience.
          </p>

          <div className="match-loading-bar">
            <div className="match-loading-progress"></div>
          </div>

          <span className="match-loading-status">
            Processing your resume...
          </span>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="match-page">

        <div className="match-error-container">

          <div className="match-error-icon">
            !
          </div>

          <p className="match-loading-label">
            ANALYSIS ERROR
          </p>

          <h1>
            Unable to Complete Analysis
          </h1>

          <p>
            {error}
          </p>

          <button
            className="match-primary-button"
            onClick={() => navigate("/resume")}
          >
            ← Start Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="match-page">

      {/* NAVBAR */}
      <header className="match-navbar">

        <div
          className="match-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="match-logo-mark">
            AI
          </div>

          <span>
            Resume Matcher
          </span>
        </div>

        <button
          className="match-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

      </header>


      {/* MAIN */}
      <main className="match-content">

        {/* HEADER */}
        <section className="match-header">

          <p className="match-label">
            AI ANALYSIS COMPLETE
          </p>

          <h1>
            Your Resume Match
          </h1>

          <p>
            Here's how well your resume aligns with
            the selected job opportunity.
          </p>

        </section>


        {/* SCORE */}
        <section className="match-score-card">

          <div className="match-score-circle">

            <div className="match-score-inner">

              <strong>
                {result.final_score}%
              </strong>

              <span>
                MATCH
              </span>

            </div>

          </div>


          <div className="match-score-info">

            <span className="match-score-tag">
              OVERALL COMPATIBILITY
            </span>

            <h2>
              {result.final_score >= 80
                ? "Strong Match"
                : result.final_score >= 60
                ? "Good Match"
                : result.final_score >= 40
                ? "Partial Match"
                : "Low Match"}
            </h2>

            <p>
              Your resume has been evaluated against
              the job requirements using our AI matching
              system.
            </p>

          </div>

        </section>


        {/* SCORE BREAKDOWN */}
        <section className="match-breakdown">

          <div className="match-section-heading">

            <div>
              <p className="match-label">
                COMPATIBILITY BREAKDOWN
              </p>

              <h2>
                How your score was calculated
              </h2>
            </div>

          </div>


          <div className="match-metrics">

            <div className="match-metric">

              <div className="match-metric-top">

                <span>
                  Semantic Similarity
                </span>

                <strong>
                  {result.semantic_score}%
                </strong>

              </div>

              <div className="match-progress">
                <div
                  className="match-progress-fill"
                  style={{
                    width: `${result.semantic_score}%`
                  }}
                ></div>
              </div>

              <small>
                Overall meaning and context similarity
              </small>

            </div>


            <div className="match-metric">

              <div className="match-metric-top">

                <span>
                  Skill Match
                </span>

                <strong>
                  {result.skill_score}%
                </strong>

              </div>

              <div className="match-progress">
                <div
                  className="match-progress-fill"
                  style={{
                    width: `${result.skill_score}%`
                  }}
                ></div>
              </div>

              <small>
                Required skills found in your resume
              </small>

            </div>


            <div className="match-metric">

              <div className="match-metric-top">

                <span>
                  Education Match
                </span>

                <strong>
                  {result.education_score}%
                </strong>

              </div>

              <div className="match-progress">
                <div
                  className="match-progress-fill"
                  style={{
                    width: `${result.education_score}%`
                  }}
                ></div>
              </div>

              <small>
                Education requirements compatibility
              </small>

            </div>


            <div className="match-metric">

              <div className="match-metric-top">

                <span>
                  Experience Match
                </span>

                <strong>
                  {result.experience_score}%
                </strong>

              </div>

              <div className="match-progress">
                <div
                  className="match-progress-fill"
                  style={{
                    width: `${result.experience_score}%`
                  }}
                ></div>
              </div>

              <small>
                Required experience compatibility
              </small>

            </div>

          </div>

        </section>


        {/* SKILLS */}
        <section className="match-skills-grid">

          {/* MATCHED */}
          <div className="match-skills-card">

            <div className="match-skills-card-header">

              <div className="match-check-icon">
                ✓
              </div>

              <div>
                <h3>
                  Matched Skills
                </h3>

                <span>
                  Skills you already have
                </span>
              </div>

            </div>


            <div className="match-skill-tags">

              {result.matched_skills?.length > 0 ? (

                result.matched_skills.map((skill) => (
                  <span
                    className="match-skill-tag matched"
                    key={skill}
                  >
                    ✓ {skill}
                  </span>
                ))

              ) : (

                <p className="match-empty">
                  No matching skills detected.
                </p>

              )}

            </div>

          </div>


          {/* MISSING */}
          <div className="match-skills-card">

            <div className="match-skills-card-header">

              <div className="match-warning-icon">
                !
              </div>

              <div>
                <h3>
                  Missing Skills
                </h3>

                <span>
                  Skills you may need to develop
                </span>
              </div>

            </div>


            <div className="match-skill-tags">

              {result.missing_skills?.length > 0 ? (

                result.missing_skills.map((skill) => (
                  <span
                    className="match-skill-tag missing"
                    key={skill}
                  >
                    + {skill}
                  </span>
                ))

              ) : (

                <p className="match-empty">
                  No missing skills detected.
                </p>

              )}

            </div>

          </div>

        </section>


        {/* ACTIONS */}
        <section className="match-actions">

          <button
            className="match-secondary-button"
            onClick={() => navigate("/job-description")}
          >
            ← Edit Job Description
          </button>

          <button
            className="match-primary-button"
            onClick={handleNewAnalysis}
          >
            Analyze Another Resume →
          </button>

        </section>

      </main>

    </div>
  );
}

export default Match;