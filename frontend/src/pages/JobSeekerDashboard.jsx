import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function JobSeekerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/jobseeker/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard");
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];

    setResumeMessage("");
    setResumeError("");

    if (!file) {
      setResume(null);
      return;
    }

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setResume(null);
      setResumeError("Only PDF, DOC and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResume(null);
      setResumeError("Resume size must be less than 5 MB.");
      return;
    }

    setResume(file);
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      setResumeError("Please select a resume file.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUploading(true);
      setResumeMessage("");
      setResumeError("");

      const formData = new FormData();
      formData.append("file", resume);

      const response = await api.post("/Resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeMessage(
        response.data?.message || "Resume uploaded successfully.",
      );

      setResume(null);

      const fileInput = document.getElementById("resumeInput");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      setResumeError(
        error.response?.data?.message || "Failed to upload resume.",
      );
    } finally {
      setUploading(false);
    }
  };

  if (error) {
    return (
      <div style={styles.errorPage}>
        <h2>{error}</h2>

        <button onClick={() => navigate("/login")} style={styles.primaryButton}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  const cards = [
    {
      title: "Total Applications",
      value: dashboard.totalApplications,
    },
    {
      title: "Applied",
      value: dashboard.appliedApplications,
    },
    {
      title: "Shortlisted",
      value: dashboard.shortlistedApplications,
    },
    {
      title: "Interview",
      value: dashboard.interviewApplications,
    },
    {
      title: "Hired",
      value: dashboard.hiredApplications,
    },
    {
      title: "Rejected",
      value: dashboard.rejectedApplications,
    },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Job Seeker Dashboard</h1>

          <p style={styles.subtitle}>Track your job applications</p>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main style={styles.container}>
        {/* Application Statistics */}

        <div style={styles.grid}>
          {cards.map((card) => (
            <div key={card.title} style={styles.card}>
              <h3 style={styles.cardTitle}>{card.title}</h3>

              <p style={styles.cardValue}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Resume Section */}

        <div style={styles.resumeSection}>
          <h2 style={styles.actionsTitle}>My Resume</h2>

          <p style={styles.resumeDescription}>
            Upload your latest resume to apply for jobs.
          </p>

          <div style={styles.resumeUploadArea}>
            <input
              id="resumeInput"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              style={styles.fileInput}
            />

            {resume && (
              <p style={styles.selectedFile}>
                Selected: <strong>{resume.name}</strong>
              </p>
            )}

            <button
              style={uploading ? styles.disabledButton : styles.primaryButton}
              onClick={handleResumeUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>

          {resumeMessage && (
            <p style={styles.successMessage}>{resumeMessage}</p>
          )}

          {resumeError && <p style={styles.resumeError}>{resumeError}</p>}

          <p style={styles.fileInfo}>
            Accepted formats: PDF, DOC, DOCX • Maximum size: 5 MB
          </p>
        </div>

        {/* Quick Actions */}

        <div style={styles.actionsSection}>
          <h2 style={styles.actionsTitle}>Quick Actions</h2>

          <div style={styles.actions}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/jobseeker/applications")}
            >
              My Applications
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </button>
          </div>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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

  resumeSection: {
    marginTop: "35px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  resumeDescription: {
    color: "#6b7280",
    margin: "8px 0 20px",
  },

  resumeUploadArea: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  fileInput: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
  },

  selectedFile: {
    margin: 0,
    color: "#374151",
    fontSize: "14px",
  },

  successMessage: {
    marginTop: "15px",
    marginBottom: 0,
    color: "#16a34a",
    fontWeight: "500",
  },

  resumeError: {
    marginTop: "15px",
    marginBottom: 0,
    color: "#dc2626",
    fontWeight: "500",
  },

  fileInfo: {
    marginTop: "15px",
    marginBottom: 0,
    color: "#9ca3af",
    fontSize: "13px",
  },

  actionsSection: {
    marginTop: "35px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  actionsTitle: {
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
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
  },

  disabledButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#9ca3af",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "not-allowed",
  },

  secondaryButton: {
    padding: "12px 20px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2563eb",
    fontSize: "14px",
    cursor: "pointer",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
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

export default JobSeekerDashboard;
