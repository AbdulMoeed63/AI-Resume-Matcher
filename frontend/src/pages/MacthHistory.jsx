import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../services/api";


function MatchHistory() {

  const navigate = useNavigate();


  const [matches, setMatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [clearing, setClearing] =
    useState(false);


  /*
   * Load match history
   */
  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const response =
          await API.get("/match/");


        console.log(
          "MATCH HISTORY RESPONSE:",
          response.data
        );


        setMatches(
          response.data.matches || []
        );

      } catch (err) {

        console.error(
          "MATCH HISTORY ERROR:",
          err
        );


        setError(
          err.response?.data?.detail ||
          "Could not load match history."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchHistory();

  }, []);


  const getMatchLabel = (score) => {

    const value =
      Number(score);


    if (value >= 80) {
      return "Strong Match";
    }


    if (value >= 60) {
      return "Good Match";
    }


    if (value >= 40) {
      return "Partial Match";
    }


    return "Low Match";

  };


  const formatDate = (date) => {

    if (!date) {
      return "Date unavailable";
    }


    try {

      return new Date(
        date
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      );

    } catch {

      return "Date unavailable";

    }

  };


  const handleClearHistory = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to clear your entire match history? This will permanently delete these compatibility results from the database."
      );


    if (!confirmed) {
      return;
    }


    setClearing(true);

    setError("");


    try {

      const response =
        await API.delete(
          "/match/history"
        );


      console.log(
        "CLEAR HISTORY RESPONSE:",
        response.data
      );


      setMatches([]);

    } catch (err) {

      console.error(
        "CLEAR HISTORY ERROR:",
        err
      );


      setError(
        err.response?.data?.detail ||
        "Failed to clear match history."
      );

    } finally {

      setClearing(false);

    }

  };


  return (

    <div className="history-page">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="history-navbar">

        <div
          className="history-logo"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          <div className="history-logo-mark">
            AI
          </div>

          <span>
            Resume Matcher
          </span>

        </div>


        <button
          className="history-dashboard-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="history-content">


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="history-header">

          <div>

            <p className="history-label">
              AI CAREER INTELLIGENCE
            </p>

            <h1>
              Match History
            </h1>

            <p>
              Review your previous resume compatibility analyses.
            </p>

          </div>


          <div className="history-header-actions">

            {matches.length > 0 && (

              <button
                className="history-clear-button"
                onClick={handleClearHistory}
                disabled={clearing}
              >

                {clearing
                  ? "Clearing..."
                  : "Clear History"}

              </button>

            )}


            <button
              className="history-new-button"
              onClick={() =>
                navigate("/resume")
              }
            >
              + New Analysis
            </button>

          </div>

        </section>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <section className="history-state-card">

            <div className="history-spinner"></div>

            <h2>
              Loading Match History
            </h2>

            <p>
              Retrieving your previous AI analyses...
            </p>

          </section>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (

            <section className="history-state-card">

              <div className="history-error-icon">
                !
              </div>

              <h2>
                Unable to Load History
              </h2>

              <p>
                {error}
              </p>

              <button
                className="history-primary-button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

            </section>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          matches.length === 0 && (

            <section className="history-state-card">

              <div className="history-empty-icon">
                AI
              </div>

              <h2>
                No Match History Yet
              </h2>

              <p>
                No previous AI analyses were found for your account.
              </p>

              <button
                className="history-primary-button"
                onClick={() =>
                  navigate("/resume")
                }
              >
                Start New Analysis →
              </button>

            </section>

        )}


        {/* =================================================
            HISTORY LIST
        ================================================= */}

        {!loading &&
          !error &&
          matches.length > 0 && (

            <section className="history-list">

              {matches.map(
                (match, index) => (

                  <article
                    className="history-card"
                    key={
                      match.id ||
                      index
                    }
                    style={{
                      "--history-delay":
                        `${index * 0.10}s`
                    }}
                  >


                    {/* LEFT */}

                    <div className="history-card-main">

                      <div className="history-file-icon">
                        📄
                      </div>


                      <div className="history-card-info">

                        <div className="history-card-top">

                          <h2>
                            Resume Match Analysis
                          </h2>

                          <span>
                            {formatDate(
                              match.created_at
                            )}
                          </span>

                        </div>


                        <p>
                          Match ID:{" "}
                          {match.id ||
                            "N/A"}
                        </p>


                        {/* MINI STATS */}

                        <div className="history-mini-stats">


                          <div>

                            <span>
                              SEMANTIC
                            </span>

                            <strong>
                              {match.semantic_score ??
                                0}
                              %
                            </strong>

                          </div>


                          <div>

                            <span>
                              SKILLS
                            </span>

                            <strong>
                              {match.skill_score ??
                                0}
                              %
                            </strong>

                          </div>


                          <div>

                            <span>
                              EDUCATION
                            </span>

                            <strong>
                              {match.education_score == null
                                ? "Not specified"
                                : `${match.education_score}%`}
                            </strong>

                          </div>


                          <div>

                            <span>
                              EXPERIENCE
                            </span>

                            <strong>
                              {match.experience_score == null
                                ? "Not specified"
                                : `${match.experience_score}%`}
                            </strong>

                          </div>


                        </div>

                      </div>

                    </div>


                    {/* RIGHT SCORE */}

                    <div className="history-score-section">

                      <div className="history-score">

                        <strong>
                          {match.final_score ?? 0}%
                        </strong>

                        <span>
                          MATCH
                        </span>

                      </div>


                      <span className="history-match-label">

                        {getMatchLabel(
                          match.final_score
                        )}

                      </span>

                    </div>


                  </article>

                )
              )}

            </section>

        )}

      </main>

    </div>

  );

}


export default MatchHistory;