import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [dashboardResponse, jobsResponse] = await Promise.all([
          api.get("/recruiter/dashboard", { headers }),
          api.get("/recruiter/jobs", { headers }),
        ]);

        setDashboard(dashboardResponse.data);
        setJobs(jobsResponse.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load recruiter dashboard",
        );
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeactivate = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this job?",
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await api.put(
        `/job/${jobId}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobs((previousJobs) =>
        previousJobs.map((job) =>
          job.id === jobId ? { ...job, isActive: false } : job,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to deactivate job");
    }
  };

  if (error) {
    return (
      <div style={styles.errorPage}>
        <h2>{error}</h2>

        <button style={styles.primaryButton} onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return <div style={styles.loading}>Loading recruiter dashboard...</div>;
  }

  const cards = [
    {
      title: "Total Companies",
      value: dashboard.totalCompanies,
    },
    {
      title: "Total Jobs",
      value: dashboard.totalJobs,
    },
    {
      title: "Total Applications",
      value: dashboard.totalApplications,
    },
    {
      title: "Shortlisted",
      value: dashboard.shortlistedApplications,
    },
    {
      title: "Hired",
      value: dashboard.hiredApplications,
    },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Recruiter Dashboard</h1>

          <p style={styles.subtitle}>
            Manage your companies, jobs and applications
          </p>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main style={styles.container}>
        {/* Statistics */}
        <div style={styles.grid}>
          {cards.map((card) => (
            <div key={card.title} style={styles.card}>
              <h3 style={styles.cardTitle}>{card.title}</h3>

              <p style={styles.cardValue}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsSection}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>

          <div style={styles.actions}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/recruiter/jobs/create")}
            >
              + Post New Job
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/recruiter/companies")}
            >
              My Companies
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/recruiter/companies/create")}
            >
              + Add Company
            </button>
          </div>
        </div>

        {/* My Jobs */}
        <div style={styles.jobsSection}>
          <div style={styles.jobsHeader}>
            <div>
              <h2 style={styles.sectionTitle}>My Jobs</h2>

              <p style={styles.jobsSubtitle}>
                Manage your posted jobs and applications
              </p>
            </div>

            <button
              style={styles.primaryButton}
              onClick={() => navigate("/recruiter/jobs/create")}
            >
              + Post New Job
            </button>
          </div>

          {jobs.length === 0 ? (
            <div style={styles.empty}>
              <h3>No jobs posted yet</h3>

              <p>
                Create your first job posting to start receiving applications.
              </p>

              <button
                style={styles.primaryButton}
                onClick={() => navigate("/recruiter/jobs/create")}
              >
                Create Your First Job
              </button>
            </div>
          ) : (
            <div style={styles.jobsList}>
              {jobs.map((job) => (
                <div key={job.id} style={styles.jobCard}>
                  <div style={styles.jobInfo}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>

                    <p style={styles.company}>🏢 {job.company}</p>

                    <div style={styles.jobDetails}>
                      <span>📍 {job.location}</span>

                      <span>💼 {job.employmentType}</span>

                      <span>🎓 {job.experienceLevel}</span>

                      <span>💰 {job.salaryRange}</span>
                    </div>

                    <span
                      style={
                        job.isActive ? styles.activeBadge : styles.inactiveBadge
                      }
                    >
                      {job.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <div style={styles.jobActions}>
                    {/* Edit */}
                    <button
                      style={styles.editButton}
                      onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
                    >
                      Edit
                    </button>

                    {/* Applications */}
                    <button
                      style={styles.viewButton}
                      onClick={() =>
                        navigate(`/recruiter/applications/${job.id}`)
                      }
                    >
                      Applications
                    </button>

                    {/* Deactivate */}
                    {job.isActive && (
                      <button
                        style={styles.deactivateButton}
                        onClick={() => handleDeactivate(job.id)}
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
  },

  header: {
    background: "#ffffff",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
  },

  heading: {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
  },

  logoutButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
  },

  container: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  cardTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "15px",
    fontWeight: "500",
  },

  cardValue: {
    margin: "15px 0 0",
    fontSize: "36px",
    fontWeight: "700",
    color: "#2563eb",
  },

  actionsSection: {
    marginTop: "35px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  sectionTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "20px",
  },

  actions: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "11px 18px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2563eb",
    fontSize: "14px",
    cursor: "pointer",
  },

  jobsSection: {
    marginTop: "35px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  jobsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  jobsSubtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  jobsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  jobCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  jobInfo: {
    flex: 1,
  },

  jobTitle: {
    margin: 0,
    fontSize: "19px",
    color: "#111827",
  },

  company: {
    margin: "7px 0",
    color: "#4b5563",
    fontSize: "14px",
  },

  jobDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "12px",
    color: "#6b7280",
    fontSize: "13px",
  },

  activeBadge: {
    display: "inline-block",
    marginTop: "12px",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
  },

  inactiveBadge: {
    display: "inline-block",
    marginTop: "12px",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: "600",
  },

  jobActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  editButton: {
    padding: "10px 15px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "13px",
  },

  viewButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
  },

  deactivateButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
  },

  empty: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    color: "#6b7280",
  },

  errorPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
  },
};

export default RecruiterDashboard;
