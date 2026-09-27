import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/jobapplication/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load applications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "SHORTLISTED":
        return styles.shortlisted;

      case "INTERVIEW":
        return styles.interview;

      case "HIRED":
        return styles.hired;

      case "REJECTED":
        return styles.rejected;

      default:
        return styles.applied;
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading applications...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorPage}>
        <h2>{error}</h2>

        <button style={styles.button} onClick={() => navigate("/jobseeker")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>My Applications</h1>

          <p style={styles.subtitle}>
            Track the status of your job applications
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/jobseeker")}
        >
          ← Dashboard
        </button>
      </header>

      <main style={styles.container}>
        {applications.length === 0 ? (
          <div style={styles.empty}>
            <h2>No Applications Yet</h2>

            <p>You haven't applied for any jobs yet.</p>

            <button style={styles.button} onClick={() => navigate("/jobs")}>
              Browse Jobs
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {applications.map((application) => (
              <div key={application.id} style={styles.card}>
                <div style={styles.topRow}>
                  <div>
                    <h2 style={styles.jobTitle}>{application.job}</h2>

                    <p style={styles.company}>{application.company}</p>
                  </div>

                  <span
                    style={{
                      ...styles.status,
                      ...getStatusStyle(application.status),
                    }}
                  >
                    {application.status}
                  </span>
                </div>

                <div style={styles.info}>
                  <span>
                    Applied:{" "}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={styles.coverLetter}>
                  <strong>Cover Letter</strong>

                  <p>
                    {application.coverLetter || "No cover letter provided."}
                  </p>
                </div>

                <button
                  style={styles.viewButton}
                  onClick={() => navigate("/jobs")}
                >
                  Browse More Jobs
                </button>
              </div>
            ))}
          </div>
        )}
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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  jobTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "22px",
  },

  company: {
    margin: "7px 0 0",
    color: "#2563eb",
    fontWeight: "600",
  },

  status: {
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  applied: {
    background: "#f3f4f6",
    color: "#374151",
  },

  shortlisted: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  interview: {
    background: "#fef3c7",
    color: "#b45309",
  },

  hired: {
    background: "#dcfce7",
    color: "#15803d",
  },

  rejected: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  info: {
    marginTop: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },

  coverLetter: {
    marginTop: "18px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "8px",
    color: "#374151",
  },

  viewButton: {
    marginTop: "20px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
  },

  empty: {
    background: "#ffffff",
    padding: "60px 30px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#6b7280",
  },

  button: {
    marginTop: "15px",
    padding: "11px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

export default MyApplications;
