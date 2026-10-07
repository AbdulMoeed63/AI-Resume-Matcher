import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../services/api";


function Match() {

  const navigate = useNavigate();

  const matchStarted = useRef(false);

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const [animatedScore, setAnimatedScore] = useState(0);


  /*
   * Animate the main match percentage
   */
  useEffect(() => {

    if (!result) {
      return;
    }

    const target = Number(
      result.final_score || 0
    );

    let current = 0;

    const duration = 1400;

    const intervalTime = 20;

    const increment =
      target /
      (duration / intervalTime);

    const interval = setInterval(() => {

      current += increment;

      if (current >= target) {

        current = target;

        clearInterval(interval);
      }

      setAnimatedScore(
        Number(current.toFixed(1))
      );

    }, intervalTime);


    return () => {
      clearInterval(interval);
    };

  }, [result]);


  /*
   * Run matching request
   */
  useEffect(() => {

    const runMatch = async () => {

      // Prevent React StrictMode from
      // creating the same match twice
      if (matchStarted.current) {
        return;
      }

      matchStarted.current = true;


      const resumeId =
        localStorage.getItem("resume_id");

      const jobId =
        localStorage.getItem("job_id");


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

    localStorage.removeItem(
      "resume_id"
    );

    localStorage.removeItem(
      "job_id"
    );

    navigate("/resume");

  };


  /*
   * Loading screen
   */
  if (loading) {

    return (

      <div className="match-page">

        <div className="match-loading-orbit"></div>

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


  /*
   * Error screen
   */
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
            onClick={() =>
              navigate("/resume")
            }
          >
            ← Start Again
          </button>

        </div>

      </div>

    );

  }


  /*
   * Calculate ring percentage
   */
  const score = Number(
    result?.final_score || 0
  );


  const matchTitle =
    score >= 80
      ? "Strong Match"
      : score >= 60
      ? "Good Match"
      : score >= 40
      ? "Partial Match"
      : "Low Match";


  /*
   * Education and experience may be null
   * when the job description does not specify
   * those requirements.
   */
  const educationSpecified =
    result.education_score !== null &&
    result.education_score !== undefined;

  const experienceSpecified =
    result.experience_score !== null &&
    result.experience_score !== undefined;


  return (

    <div className="match-page">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="match-navbar">

        <div
          className="match-logo"
          onClick={() =>
            navigate("/dashboard")
          }
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
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Dashboard
        </button>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="match-content">


        {/* =================================================
            HEADER
        ================================================= */}

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


        {/* =================================================
            SCORE
        ================================================= */}

        <section className="match-score-card">


          <div
            className="match-score-circle"
            style={{
              "--match-score": `${score}%`
            }}
          >

            <div className="match-score-inner">

              <strong>
                {animatedScore}%
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
              {matchTitle}
            </h2>

            <p>
              Your resume has been evaluated against
              the job requirements using our AI matching
              system.
            </p>

          </div>

        </section>


        {/* =================================================
            SCORE BREAKDOWN
        ================================================= */}

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


            {/* SEMANTIC */}

            <div
              className="match-metric"
              style={{
                "--animation-delay": "0.15s"
              }}
            >

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
                    width:
                      `${result.semantic_score}%`
                  }}
                ></div>

              </div>


              <small>
                Overall meaning and context similarity
              </small>

            </div>


            {/* SKILL */}

            <div
              className="match-metric"
              style={{
                "--animation-delay": "0.25s"
              }}
            >

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
                    width:
                      `${result.skill_score}%`
                  }}
                ></div>

              </div>


              <small>
                Required skills found in your resume
              </small>

            </div>


            {/* EDUCATION */}

            <div
              className="match-metric"
              style={{
                "--animation-delay": "0.35s"
              }}
            >

              <div className="match-metric-top">

                <span>
                  Education Match
                </span>

                <strong>
                  {educationSpecified
                    ? `${result.education_score}%`
                    : "Not specified"}
                </strong>

              </div>


              <div className="match-progress">

                <div
                  className={
                    educationSpecified
                      ? "match-progress-fill"
                      : "match-progress-fill not-applicable"
                  }
                  style={{
                    width:
                      educationSpecified
                        ? `${result.education_score}%`
                        : "0%"
                  }}
                ></div>

              </div>


              <small>
                {educationSpecified
                  ? "Education requirements compatibility"
                  : "No education requirement specified"}
              </small>

            </div>


            {/* EXPERIENCE */}

            <div
              className="match-metric"
              style={{
                "--animation-delay": "0.45s"
              }}
            >

              <div className="match-metric-top">

                <span>
                  Experience Match
                </span>

                <strong>
                  {experienceSpecified
                    ? `${result.experience_score}%`
                    : "Not specified"}
                </strong>

              </div>


              <div className="match-progress">

                <div
                  className={
                    experienceSpecified
                      ? "match-progress-fill"
                      : "match-progress-fill not-applicable"
                  }
                  style={{
                    width:
                      experienceSpecified
                        ? `${result.experience_score}%`
                        : "0%"
                  }}
                ></div>

              </div>


              <small>
                {experienceSpecified
                  ? "Required experience compatibility"
                  : "No experience requirement specified"}
              </small>

            </div>


          </div>

        </section>


        {/* =================================================
            SKILLS
        ================================================= */}

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

                result.matched_skills.map(
                  (skill, index) => (

                    <span
                      className="match-skill-tag matched"
                      key={skill}
                      style={{
                        "--skill-delay":
                          `${index * 0.07}s`
                      }}
                    >
                      ✓ {skill}
                    </span>

                  )

                )

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

                result.missing_skills.map(
                  (skill, index) => (

                    <span
                      className="match-skill-tag missing"
                      key={skill}
                      style={{
                        "--skill-delay":
                          `${index * 0.07}s`
                      }}
                    >
                      + {skill}
                    </span>

                  )

                )

              ) : (

                <p className="match-empty">
                  No missing skills detected.
                </p>

              )}

            </div>

          </div>


        </section>


        {/* =================================================
            AI EXPLANATION
        ================================================= */}

        <section className="match-ai-explanation">

          <div className="match-ai-header">

            <div className="match-ai-icon">
              AI
            </div>

            <div>

              <p className="match-label">
                AI CAREER INSIGHT
              </p>

              <h2>
                AI Explanation
              </h2>

              <p>
                Personalized insights based on your compatibility results.
              </p>

            </div>

          </div>


          <div className="match-ai-content">

            {result.ai_explanation ? (

              result.ai_explanation
                .split("\n")
                .map((line, index) => {

                  if (!line.trim()) {

                    return (
                      <div
                        key={index}
                        className="match-ai-space"
                      />
                    );

                  }


                  return (

                    <p
                      key={index}
                      style={{
                        "--ai-line-delay":
                          `${index * 0.035}s`
                      }}
                    >
                      {line}
                    </p>

                  );

                })

            ) : (

              <p>
                AI explanation is not available for this analysis.
              </p>

            )}

          </div>

        </section>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <section className="match-actions">

          <button
            className="match-secondary-button"
            onClick={() =>
              navigate("/job-description")
            }
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