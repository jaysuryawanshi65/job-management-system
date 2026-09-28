import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import RecruiterApplications from "./pages/RecruiterApplications";
import MyApplications from "./pages/MyApplications";
import RecruiterCompanies from "./pages/RecruiterCompanies";
import CreateCompany from "./pages/CreateCompany";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Job Seeker Routes */}
        <Route element={<ProtectedRoute allowedRoles={["JOB_SEEKER"]} />}>
          <Route path="/jobseeker" element={<JobSeekerDashboard />} />

          <Route path="/jobseeker/applications" element={<MyApplications />} />

          <Route path="/jobs/:id/apply" element={<ApplyJob />} />
        </Route>

        {/* Recruiter Routes */}
        <Route element={<ProtectedRoute allowedRoles={["RECRUITER"]} />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />

          <Route
            path="/recruiter/applications/:jobId"
            element={<RecruiterApplications />}
          />

          <Route path="/recruiter/companies" element={<RecruiterCompanies />} />

          <Route
            path="/recruiter/companies/create"
            element={<CreateCompany />}
          />

          <Route path="/recruiter/jobs/create" element={<CreateJob />} />

          <Route path="/recruiter/jobs/edit/:id" element={<EditJob />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
