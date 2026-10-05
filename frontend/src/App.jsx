import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import JobDescription from "./pages/JobDescription";
import Match from "./pages/Match";
import MatchHistory from "./pages/MacthHistory";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/resume"
          element={<ResumeUpload />}
        />

         <Route
          path="/job-description"
          element={<JobDescription />}
        />

        <Route
          path="/match"
          element={<Match />}
        />

        <Route
          path="/history"
          element={<MatchHistory />}
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;