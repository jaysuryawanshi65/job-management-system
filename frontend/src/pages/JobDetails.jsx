import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/job/${id}`);
        setJob(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div style={styles.loading}>Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div style={styles.errorPage}>
        <h2>{error || "Job not found"}</h2>

        <button style={styles.backButton} onClick={() => navigate("/jobs")}>
          ← Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Job Details</h1>

          <p style={styles.subtitle}>Explore this opportunity</p>
        </div>

        <button style={styles.backButton} onClick={() => navigate("/jobs")}>
          ← Back to Jobs
        </button>
      </header>

      <main style={styles.container}>
        {/* Job Header */}
        <div style={styles.heroCard}>
          <div>
            <h2 style={styles.jobTitle}>{job.title}</h2>

            <p style={styles.company}>🏢 {job.company}</p>
          </div>

          <span style={styles.activeBadge}>ACTIVE</span>
        </div>

        {/* Job Information */}
        <div style={styles.infoCard}>
          <h3 style={styles.sectionTitle}>Job Information</h3>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Location</span>

              <span style={styles.infoValue}>
                📍 {job.location || "Not specified"}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Employment Type</span>

              <span style={styles.infoValue}>💼 {job.employmentType}</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Experience Level</span>

              <span style={styles.infoValue}>🎓 {job.experienceLevel}</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Salary</span>

              <span style={styles.infoValue}>
                💰 {job.salaryRange || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={styles.descriptionCard}>
          <h3 style={styles.sectionTitle}>Job Description</h3>

          <p style={styles.description}>{job.description}</p>
        </div>

        {/* Apply */}
        <div style={styles.applyCard}>
          <div>
            <h3 style={styles.applyTitle}>Interested in this opportunity?</h3>

            <p style={styles.applyText}>
              Submit your application and take the next step in your career.
            </p>
          </div>

          <button
            style={styles.applyButton}
            onClick={() => navigate(`/jobs/${job.id}/apply`)}
          >
            Apply Now
          </button>
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

  backButton: {
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  heroCard: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  jobTitle: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  company: {
    margin: "10px 0 0",
    fontSize: "16px",
    color: "#4b5563",
  },

  activeBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
  },

  infoCard: {
    marginTop: "20px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  sectionTitle: {
    margin: "0 0 20px",
    fontSize: "20px",
    color: "#111827",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  infoLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },

  infoValue: {
    fontSize: "15px",
    color: "#111827",
    fontWeight: "500",
  },

  descriptionCard: {
    marginTop: "20px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  description: {
    margin: 0,
    color: "#4b5563",
    lineHeight: "1.8",
    whiteSpace: "pre-line",
  },

  applyCard: {
    marginTop: "20px",
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  applyTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
  },

  applyText: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  applyButton: {
    padding: "13px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#6b7280",
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

export default JobDetails;
