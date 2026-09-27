import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function RecruiterApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resumeLoading, setResumeLoading] = useState(null);

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.get(`/jobapplication/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    const token = localStorage.getItem("token");

    try {
      await api.put(`/jobapplication/${applicationId}/status`, status, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const viewResume = async (applicationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setResumeLoading(applicationId);

      const response = await api.get(`/Resume/application/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const fileUrl = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"] || "application/pdf",
        }),
      );

      window.open(fileUrl, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      let message = "Failed to open resume.";

      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const data = JSON.parse(text);

          message = data.message || message;
        } catch {
          // Keep default message
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      alert(message);
    } finally {
      setResumeLoading(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "APPLIED") {
      return styles.applied;
    }

    if (status === "SHORTLISTED") {
      return styles.shortlisted;
    }

    if (status === "INTERVIEW") {
      return styles.interview;
    }

    if (status === "HIRED") {
      return styles.hired;
    }

    if (status === "REJECTED") {
      return styles.rejected;
    }

    return {};
  };

  if (loading) {
    return <div style={styles.loading}>Loading applications...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorPage}>
        <h2>{error}</h2>

        <button
          style={styles.backButton}
          onClick={() => navigate("/recruiter")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Job Applications</h1>

          <p style={styles.subtitle}>Review and manage applications</p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/recruiter")}
        >
          ← Dashboard
        </button>
      </header>

      <main style={styles.container}>
        <div style={styles.card}>
          <div style={styles.titleRow}>
            <h2 style={styles.sectionTitle}>Applications</h2>

            <span style={styles.count}>{applications.length} applicants</span>
          </div>

          {applications.length === 0 ? (
            <div style={styles.empty}>
              <h3>No applications yet</h3>

              <p>Applicants will appear here when they apply for this job.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {applications.map((application) => (
                <div style={styles.application} key={application.id}>
                  <div style={styles.topRow}>
                    <div>
                      <h3 style={styles.name}>{application.jobSeeker}</h3>

                      <p style={styles.email}>{application.email}</p>
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

                  <div style={styles.coverLetter}>
                    <strong>Cover Letter</strong>

                    <p>
                      {application.coverLetter || "No cover letter provided."}
                    </p>
                  </div>

                  <div style={styles.bottomRow}>
                    <span style={styles.date}>
                      Applied:{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </span>

                    <div style={styles.actions}>
                      <button
                        style={
                          resumeLoading === application.id
                            ? styles.disabledResumeButton
                            : styles.resumeButton
                        }
                        onClick={() => viewResume(application.id)}
                        disabled={resumeLoading === application.id}
                      >
                        {resumeLoading === application.id
                          ? "Opening..."
                          : "View Resume"}
                      </button>

                      <select
                        style={styles.select}
                        value={application.status}
                        onChange={(e) =>
                          updateStatus(application.id, e.target.value)
                        }
                      >
                        <option value="APPLIED">APPLIED</option>

                        <option value="SHORTLISTED">SHORTLISTED</option>

                        <option value="INTERVIEW">INTERVIEW</option>

                        <option value="REJECTED">REJECTED</option>

                        <option value="HIRED">HIRED</option>
                      </select>
                    </div>
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

  backButton: {
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 5px 25px rgba(0, 0, 0, 0.06)",
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  sectionTitle: {
    margin: 0,
    color: "#111827",
  },

  count: {
    color: "#6b7280",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  application: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  name: {
    margin: 0,
    fontSize: "19px",
    color: "#111827",
  },

  email: {
    margin: "6px 0 0",
    color: "#6b7280",
  },

  status: {
    padding: "6px 12px",
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

  coverLetter: {
    marginTop: "20px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "8px",
    color: "#374151",
  },

  bottomRow: {
    marginTop: "18px",
    paddingTop: "15px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  date: {
    color: "#6b7280",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  resumeButton: {
    padding: "9px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#16a34a",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },

  disabledResumeButton: {
    padding: "9px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#9ca3af",
    color: "#ffffff",
    cursor: "not-allowed",
    fontSize: "13px",
  },

  select: {
    padding: "9px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "50px 20px",
    color: "#6b7280",
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

export default RecruiterApplications;
