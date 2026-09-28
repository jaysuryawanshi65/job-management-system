import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function ApplyJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!coverLetter.trim()) {
      setError("Please enter a cover letter.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post(
        "/jobapplication",
        {
          jobId: Number(id),
          coverLetter: coverLetter.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Application submitted successfully!");

      navigate("/jobseeker/applications");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!job) {
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
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Apply for Job</h1>

          <p style={styles.subtitle}>Submit your application</p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate(`/jobs/${id}`)}
        >
          ← Job Details
        </button>
      </header>

      <main style={styles.container}>
        {/* Job Summary */}
        <div style={styles.jobCard}>
          <h2 style={styles.jobTitle}>{job.title}</h2>

          <p style={styles.company}>🏢 {job.company}</p>

          <div style={styles.details}>
            <span>📍 {job.location}</span>
            <span>💼 {job.employmentType}</span>
            <span>🎓 {job.experienceLevel}</span>
            <span>💰 {job.salaryRange}</span>
          </div>
        </div>

        {/* Application Form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Application Form</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Cover Letter</label>

              <textarea
                style={styles.textarea}
                placeholder="Write a short cover letter explaining why you are suitable for this job..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                maxLength={1000}
                required
              />

              <div style={styles.counter}>{coverLetter.length}/1000</div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.applyButton,
                opacity: submitting ? 0.7 : 1,
              }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
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
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  jobCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
    marginBottom: "20px",
  },

  jobTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#111827",
  },

  company: {
    margin: "8px 0 15px",
    color: "#4b5563",
  },

  details: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    color: "#6b7280",
    fontSize: "14px",
  },

  formCard: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  formTitle: {
    margin: "0 0 25px",
    fontSize: "22px",
    color: "#111827",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
  },

  textarea: {
    width: "100%",
    padding: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: "1.6",
  },

  counter: {
    textAlign: "right",
    marginTop: "5px",
    fontSize: "12px",
    color: "#6b7280",
  },

  applyButton: {
    width: "100%",
    marginTop: "20px",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
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

export default ApplyJob;
