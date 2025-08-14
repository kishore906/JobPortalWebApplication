import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import "quill/dist/quill.snow.css";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import RecruiterLogin from "./components/RecruiterLogin";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import UserLogin from "./components/UserLogin";
import EditProfile from "./pages/EditProfile";
import EditPassword from "./pages/EditPassword";
import CompanyStatistics from "./pages/CompanyStatistics";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AllUsers from "./pages/Admin/AllUsers";
import AllCompanies from "./pages/Admin/AllCompanies";
import AllJobs from "./pages/Admin/AllJobs";
import AdminStats from "./pages/Admin/AdminStats";

function App() {
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  return (
    <>
      {showRecruiterLogin && (
        <RecruiterLogin setShowRecruiterLogin={setShowRecruiterLogin} />
      )}
      {showUserLogin && <UserLogin setShowUserLogin={setShowUserLogin} />}
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
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<CompanyStatistics />} />
          <Route path="statistics" element={<CompanyStatistics />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-password" element={<EditPassword />} />
        <Route path="/adminDashboard" element={<AdminDashboard />}>
          <Route index element={<AdminStats />} />
          <Route path="statistics" element={<AdminStats />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="all-companies" element={<AllCompanies />} />
          <Route path="all-jobs" element={<AllJobs />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
