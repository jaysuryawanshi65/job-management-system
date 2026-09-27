import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function RecruiterCompanies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/company/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCompanies(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load your companies"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading companies...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Companies</h1>
          <p style={styles.subtitle}>
            Manage the companies you have created.
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => navigate("/recruiter/companies/create")}
        >
          + Add Company
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {!error && companies.length === 0 && (
        <div style={styles.empty}>
          <h3>No companies found</h3>
          <p>
            You haven't created any company yet.
          </p>

          <button
            style={styles.addButton}
            onClick={() => navigate("/recruiter/companies/create")}
          >
            Create Your First Company
          </button>
        </div>
      )}

      {companies.length > 0 && (
        <div style={styles.grid}>
          {companies.map((company) => (
            <div key={company.id} style={styles.card}>
              <h2 style={styles.companyName}>
                {company.name}
              </h2>

              <p style={styles.description}>
                {company.description || "No description available."}
              </p>

              <div style={styles.info}>
                <strong>Location:</strong>{" "}
                {company.location || "Not specified"}
              </div>

              <div style={styles.info}>
                <strong>Website:</strong>{" "}
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.link}
                  >
                    Visit Website
                  </a>
                ) : (
                  "Not specified"
                )}
              </div>

              <div style={styles.info}>
                <strong>Recruiter:</strong>{" "}
                {company.recruiter}
              </div>

              <div style={styles.footer}>
                <span style={styles.date}>
                  Created:{" "}
                  {new Date(company.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  addButton: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  empty: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  companyName: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#111827",
  },

  description: {
    color: "#6b7280",
    lineHeight: "1.6",
    minHeight: "50px",
  },

  info: {
    marginTop: "12px",
    color: "#374151",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
  },

  footer: {
    borderTop: "1px solid #e5e7eb",
    marginTop: "20px",
    paddingTop: "15px",
  },

  date: {
    color: "#9ca3af",
    fontSize: "13px",
  },
};

export default RecruiterCompanies;