import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import ViewJob from "./pages/ViewJob";
import Applications from "./pages/Applications";
import RecruiterLogin from "./components/RecruiterLogin";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import UserLogin from "./components/UserLogin";
import EditProfile from "./pages/EditProfile";
import EditPassword from "./pages/EditPassword";
import CompanyStatistics from "./pages/CompanyStatistics";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AllUsers from "./pages/Admin/AllUsers";
import AllCompanies from "./pages/Admin/AllCompanies";
import AllJobs from "./pages/Admin/AllJobs";
import AdminStats from "./pages/Admin/AdminStats";
import AuthRoute from "./components/AuthRoute";
import ViewJobAndApplications from "./pages/ViewJobAndApplications";
import EditJob from "./pages/EditJob";
import JobInfoAndUserApplications from "./pages/JobInfoAndUserApplications";

function App() {
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  return (
    <>
      {showRecruiterLogin && (
        <RecruiterLogin setShowRecruiterLogin={setShowRecruiterLogin} />
      )}
      {showUserLogin && <UserLogin setShowUserLogin={setShowUserLogin} />}

      <ToastContainer position="top-center" theme="dark" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              setShowRecruiterLogin={setShowRecruiterLogin}
              setShowUserLogin={setShowUserLogin}
            />
          }
        />
        <Route path="/viewJob/:id" element={<ViewJob />} />
        <Route
          path="/applications"
          element={
            <AuthRoute>
              <Applications />
            </AuthRoute>
          }
        />
        <Route element={<AuthRoute role="Recruiter" />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<CompanyStatistics />} />
            <Route path="statistics" element={<CompanyStatistics />} />
            <Route path="add-job" element={<AddJob />} />
            <Route
              path="jobInfoAndUsersApplications/:id"
              element={<JobInfoAndUserApplications />}
            />
            <Route path="updateJob/:id" element={<EditJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route
              path="viewjob-and-applications"
              element={<ViewJobAndApplications />}
            />
          </Route>
        </Route>
        <Route
          path="/edit-profile"
          element={
            <AuthRoute>
              <EditProfile />
            </AuthRoute>
          }
        />
        <Route
          path="/edit-password"
          element={
            <AuthRoute>
              <EditPassword />
            </AuthRoute>
          }
        />
        <Route element={<AuthRoute role={"Admin"} />}>
          <Route path="/adminDashboard" element={<AdminDashboard />}>
            <Route index element={<AdminStats />} />
            <Route path="statistics" element={<AdminStats />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-companies" element={<AllCompanies />} />
            <Route path="all-jobs" element={<AllJobs />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
