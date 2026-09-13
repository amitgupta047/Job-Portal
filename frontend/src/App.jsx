import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplication";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";
import RecruiterAnalytics from "./pages/RecruiterAnalytics";
import RecruiterApplicants from "./pages/RecruiterApplicants";
import CandidateProfile from "./pages/CandidateProfile";
import JobAnalytics from "./pages/JobAnalytics";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/"
          element={<Home />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Candidate Dashboard */}
        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        {/* Job Details */}
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute role="candidate">
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="candidate">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route path="/recruiter-dashboard"
          element={<ProtectedRoute role="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <ProtectedRoute role="recruiter">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute role="recruiter">
              <EditJob />
            </ProtectedRoute>}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="candidate">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter-analytics"
          element={<ProtectedRoute role="recruiter">
            <RecruiterAnalytics />
          </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter-applicants"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterApplicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-profile/:applicationId"
          element={
            <ProtectedRoute role="recruiter">
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-analytics/:jobId"
          element={
          <ProtectedRoute role="recruiter">
          <JobAnalytics />
          </ProtectedRoute>
        }
      />

        <Route
          path="/notifications"
          element={
          <ProtectedRoute role="candidate">
        <Notifications />
        </ProtectedRoute>
        }
      />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

