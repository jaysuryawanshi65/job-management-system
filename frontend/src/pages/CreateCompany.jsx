import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function CreateCompany() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/company", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/recruiter/companies");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>
            Create Company
          </h1>

          <p style={styles.subtitle}>
            Add a new company to your recruiter profile
          </p>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/recruiter/companies")}
        >
          ← Companies
        </button>
      </header>

      <main style={styles.container}>
        <div style={styles.card}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>
                Company Name
              </label>

              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Enter company name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={150}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Description
              </label>

              <textarea
                style={styles.textarea}
                name="description"
                placeholder="Enter company description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                rows={5}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Location
              </label>

              <input
                style={styles.input}
                type="text"
                name="location"
                placeholder="e.g. Mumbai"
                value={formData.location}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Website
              </label>

              <input
                style={styles.input}
                type="text"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                maxLength={150}
              />
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() =>
                  navigate("/recruiter/companies")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Company"}
              </button>
            </div>
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
    maxWidth: "700px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 5px 25px rgba(0, 0, 0, 0.06)",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "25px",
  },

  cancelButton: {
    padding: "11px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },

  submitButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
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
};

export default CreateCompany;