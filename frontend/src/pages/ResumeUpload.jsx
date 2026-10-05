import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName = selectedFile.name.toLowerCase();

    if (
      !fileName.endsWith(".pdf") &&
      !fileName.endsWith(".docx")
    ) {
      setError("Only PDF and DOCX files are supported.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select your resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await API.post(
        "/resume/upload",
        formData
      );

      // Save resume ID for the next step
      localStorage.setItem(
        "resume_id",
        response.data.resume_id
      );

      setResult(response.data);

    } catch (error) {
      console.error("Resume upload error:", error);

      setError(
        error.response?.data?.detail ||
        "Failed to upload and process the resume."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">

      {/* NAVBAR */}
      <header className="resume-navbar">

        <div
          className="resume-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="resume-logo-mark">
            AI
          </div>

          <span>Resume Matcher</span>
        </div>

        <button
          className="resume-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      {/* MAIN CONTENT */}
      <main className="resume-content">

        <section className="resume-welcome">

          <div>

            <p className="resume-label">
              AI CAREER INTELLIGENCE
            </p>

            <h1>
              Analyze Your Resume
            </h1>

            <p>
              Upload your resume and let our AI analyze
              your skills, education and experience before
              matching you with job opportunities.
            </p>

          </div>

        </section>

        {/* UPLOAD CARD */}
        <section className="resume-upload-card">

          <div className="resume-upload-icon">
            📄
          </div>

          <h2>
            Upload your resume
          </h2>

          <p className="resume-card-description">
            Upload a PDF or DOCX file to begin your AI analysis.
          </p>

          <form onSubmit={handleUpload}>

            <label
              htmlFor="resume-file"
              className="resume-drop-area"
            >

              <div className="resume-cloud-icon">
                ↑
              </div>

              <strong>
                {file
                  ? file.name
                  : "Drop your resume here"}
              </strong>

              <span>
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "or click to browse from your computer"}
              </span>

              <small>
                PDF or DOCX • Maximum recommended size: 10 MB
              </small>

              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />

            </label>

            {error && (
              <div className="resume-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="resume-upload-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="resume-spinner"></span>
                  Analyzing Resume...
                </>
              ) : (
                "Upload & Analyze Resume"
              )}

            </button>

          </form>

        </section>

        {/* RESULT */}
        {result && (

          <section className="resume-result-card">

            <div className="resume-result-header">

              <div>

                <p className="resume-label">
                  ANALYSIS COMPLETE
                </p>

                <h2>
                  Resume Successfully Processed
                </h2>

              </div>

              <div className="resume-success-badge">
                ✓ Complete
              </div>

            </div>

            <div className="resume-stats">

              <div className="resume-stat">

                <span>
                  FILE
                </span>

                <strong>
                  {result.filename}
                </strong>

              </div>

              <div className="resume-stat">

                <span>
                  TEXT LENGTH
                </span>

                <strong>
                  {result.text_length} characters
                </strong>

              </div>

              <div className="resume-stat">

                <span>
                  SKILLS DETECTED
                </span>

                <strong>
                  {result.skills?.length || 0}
                </strong>

              </div>

            </div>

            <div className="resume-skills-section">

              <h3>
                Detected Skills
              </h3>

              <div className="resume-skills-list">

                {result.skills?.length > 0 ? (

                  result.skills.map((skill) => (
                    <span
                      className="resume-skill-tag"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))

                ) : (

                  <p className="no-skills">
                    No predefined skills were detected.
                  </p>

                )}

              </div>

            </div>

            <div className="resume-next-action">

              <button
                className="resume-next-button"
                onClick={() => navigate("/job-description")}
              >
                Continue to Job Description →
              </button>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default ResumeUpload;