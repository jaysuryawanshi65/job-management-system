import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/global.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingUserId, setUpdatingUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchAdminData();
  }, []);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        usersResponse,
        companiesResponse,
        jobsResponse,
        applicationsResponse,
      ] = await Promise.all([
        api.get("/admin/users", authConfig),
        api.get("/admin/companies", authConfig),
        api.get("/admin/jobs", authConfig),
        api.get("/admin/applications", authConfig),
      ]);

      setUsers(usersResponse.data);
      setCompanies(companiesResponse.data);
      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load admin dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleUserStatus = async (user) => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Admin cannot be deactivated
    if (user.role === "ADMIN" && user.isActive) {
      alert("Admin users cannot be deactivated.");
      return;
    }

    const newStatus = !user.isActive;

    const action = newStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} user "${user.username}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(user.id);

      await api.put(`/admin/users/${user.id}/status`, newStatus, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                isActive: newStatus,
              }
            : currentUser,
        ),
      );
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "badge badge-admin";

      case "RECRUITER":
        return "badge badge-recruiter";

      case "JOB_SEEKER":
        return "badge badge-job-seeker";

      default:
        return "badge";
    }
  };

  const getApplicationStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "badge badge-applied";

      case "SHORTLISTED":
        return "badge badge-shortlisted";

      case "INTERVIEW":
        return "badge badge-interview";

      case "HIRED":
        return "badge badge-hired";

      case "REJECTED":
        return "badge badge-rejected";

      default:
        return "badge";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>

        <div className="loading-text">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>

          <p className="admin-subtitle">
            Manage users, companies, jobs and applications.
          </p>
        </div>

        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && <div className="error-message">{error}</div>}

      {/* =========================================
          STATISTICS
      ========================================= */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <p className="stat-label">Total Users</p>

            <p className="stat-value">{users.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>

          <div>
            <p className="stat-label">Companies</p>

            <p className="stat-value">{companies.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>

          <div>
            <p className="stat-label">Jobs</p>

            <p className="stat-value">{jobs.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>

          <div>
            <p className="stat-label">Applications</p>

            <p className="stat-value">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* =========================================
          USERS
      ========================================= */}

      <section className="dashboard-section">
        <h2 className="section-title">Users</h2>

        <p className="section-subtitle">
          Manage registered users and account status.
        </p>

        {users.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>
                      <strong>{user.username}</strong>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.isActive ? (
                        <span className="badge badge-active">ACTIVE</span>
                      ) : (
                        <span className="badge badge-inactive">INACTIVE</span>
                      )}
                    </td>

                    <td>{formatDate(user.createdAt)}</td>

                    <td>
                      {user.role === "ADMIN" ? (
                        <span className="protected">Protected</span>
                      ) : (
                        <button
                          className={
                            user.isActive
                              ? "btn btn-deactivate"
                              : "btn btn-activate"
                          }
                          onClick={() => handleUserStatus(user)}
                          disabled={updatingUserId === user.id}
                        >
                          {updatingUserId === user.id
                            ? "Updating..."
                            : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================================
          COMPANIES
      ========================================= */}

      <section className="dashboard-section">
        <h2 className="section-title">Companies</h2>

        <p className="section-subtitle">
          View all companies registered on the platform.
        </p>

        {companies.length === 0 ? (
          <div className="empty-state">No companies found.</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Website</th>
                  <th>Recruiter</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.id}</td>

                    <td>
                      <strong>{company.name}</strong>
                    </td>

                    <td>
                      <span className="cover-letter">
                        {company.description || "-"}
                      </span>
                    </td>

                    <td>{company.location || "-"}</td>

                    <td>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="dashboard-link"
                        >
                          Visit
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{company.recruiter || "-"}</td>

                    <td>{formatDate(company.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================================
          JOBS
      ========================================= */}

      <section className="dashboard-section">
        <h2 className="section-title">Jobs</h2>

        <p className="section-subtitle">View all jobs posted by recruiters.</p>

        {jobs.length === 0 ? (
          <div className="empty-state">No jobs found.</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Employment</th>
                  <th>Experience</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Recruiter</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>

                    <td>
                      <strong>{job.title}</strong>
                    </td>

                    <td>{job.company || "-"}</td>

                    <td>{job.location || "-"}</td>

                    <td>{job.employmentType || "-"}</td>

                    <td>{job.experienceLevel || "-"}</td>

                    <td>{job.salaryRange || "-"}</td>

                    <td>
                      {job.isActive ? (
                        <span className="badge badge-active">ACTIVE</span>
                      ) : (
                        <span className="badge badge-inactive">INACTIVE</span>
                      )}
                    </td>

                    <td>{job.recruiter || "-"}</td>

                    <td>{formatDate(job.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================================
          APPLICATIONS
      ========================================= */}

      <section className="dashboard-section">
        <h2 className="section-title">Applications</h2>

        <p className="section-subtitle">
          View all job applications submitted by job seekers.
        </p>

        {applications.length === 0 ? (
          <div className="empty-state">No applications found.</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Job Seeker</th>
                  <th>Email</th>
                  <th>Cover Letter</th>
                  <th>Status</th>
                  <th>Applied At</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.id}</td>

                    <td>
                      <strong>{application.job || "-"}</strong>
                    </td>

                    <td>{application.company || "-"}</td>

                    <td>{application.jobSeeker || "-"}</td>

                    <td>{application.email || "-"}</td>

                    <td>
                      <span className="cover-letter">
                        {application.coverLetter || "-"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={getApplicationStatusClass(
                          application.status,
                        )}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td>{formatDate(application.appliedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
