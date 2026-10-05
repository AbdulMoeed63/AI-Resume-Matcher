import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function JobDescription() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check if resume exists
    const resumeId = localStorage.getItem("resume_id");

    if (!resumeId) {
      setError(
        "No uploaded resume was found. Please upload your resume first."
      );
      return;
    }

    // Basic validation
    if (!title.trim()) {
      setError("Please enter the job title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter the job description.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/job-description/",
        {
          title: title.trim(),
          company: company.trim() || null,
          description: description.trim()
        }
      );

      // Save job ID for the matching step
      localStorage.setItem(
        "job_id",
        response.data.job_id
      );

      // Move to matching page
      navigate("/match");

    } catch (error) {
      console.error(
        "Job description error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to save the job description."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-page">

      {/* NAVBAR */}
      <header className="job-navbar">

        <div
          className="job-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="job-logo-mark">
            AI
          </div>

          <span>
            Resume Matcher
          </span>
        </div>

        <button
          className="job-back-button"
          onClick={() => navigate("/resume")}
        >
          ← Resume
        </button>

      </header>


      {/* MAIN CONTENT */}
      <main className="job-content">

        {/* INTRO */}
        <section className="job-welcome">

          <p className="job-label">
            AI CAREER INTELLIGENCE
          </p>

          <h1>
            Add a Job Description
          </h1>

          <p>
            Tell us about the opportunity you want to
            evaluate. Our AI will compare the requirements
            with your resume and calculate your compatibility.
          </p>

        </section>


        {/* FORM CARD */}
        <section className="job-card">

          <div className="job-card-header">

            <div className="job-icon">
              💼
            </div>

            <div>
              <h2>
                Job Information
              </h2>

              <p>
                Enter the details of the position you want to analyze.
              </p>
            </div>

          </div>


          <form
            className="job-form"
            onSubmit={handleSubmit}
          >

            {/* JOB TITLE */}
            <div className="job-form-group">

              <label htmlFor="job-title">
                Job Title
                <span>*</span>
              </label>

              <input
                id="job-title"
                type="text"
                placeholder="e.g. Machine Learning Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

            </div>


            {/* COMPANY */}
            <div className="job-form-group">

              <label htmlFor="company">
                Company
                <span className="optional">
                  Optional
                </span>
              </label>

              <input
                id="company"
                type="text"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

            </div>


            {/* DESCRIPTION */}
            <div className="job-form-group">

              <label htmlFor="job-description">
                Job Description
                <span>*</span>
              </label>

              <textarea
                id="job-description"
                placeholder="Paste the complete job description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="12"
              />

              <div className="job-character-count">
                {description.length} characters
              </div>

            </div>


            {/* ERROR */}
            {error && (
              <div className="job-error">
                {error}
              </div>
            )}


            {/* ACTIONS */}
            <div className="job-actions">

              <button
                type="button"
                className="job-cancel-button"
                onClick={() => navigate("/resume")}
                disabled={loading}
              >
                ← Back to Resume
              </button>

              <button
                type="submit"
                className="job-submit-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="job-spinner"></span>
                    Saving Job...
                  </>
                ) : (
                  <>
                    Analyze Compatibility →
                  </>
                )}

              </button>

            </div>

          </form>

        </section>


        {/* INFORMATION */}
        <section className="job-info-section">

          <div className="job-info-item">

            <div className="job-info-number">
              01
            </div>

            <div>
              <strong>
                Resume
              </strong>

              <span>
                Your uploaded resume
              </span>
            </div>

          </div>


          <div className="job-info-line"></div>


          <div className="job-info-item">

            <div className="job-info-number">
              02
            </div>

            <div>
              <strong>
                Job
              </strong>

              <span>
                Position requirements
              </span>
            </div>

          </div>


          <div className="job-info-line"></div>


          <div className="job-info-item">

            <div className="job-info-number">
              03
            </div>

            <div>
              <strong>
                AI Match
              </strong>

              <span>
                Compatibility analysis
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default JobDescription;