import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function CreateJob() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
    salaryRange: "",
    companyId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
          error.response?.data?.message || "Failed to load your companies",
        );
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.companyId) {
      setError("Please select a company.");
      return;
    }

    try {
      await api.post(
        "/job",
        {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          employmentType: formData.employmentType,
          experienceLevel: formData.experienceLevel,
          salaryRange: formData.salaryRange,
          companyId: Number(formData.companyId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess("Job created successfully!");

      setTimeout(() => {
        navigate("/recruiter");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create New Job</h1>

        <p style={styles.subtitle}>
          Post a new job opportunity for candidates.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. .NET Developer"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter job description"
              rows="6"
              required
              style={styles.textarea}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Pune"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Type</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label>Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Experience</option>
                <option value="FRESHER">Fresher</option>
                <option value="0-2_YEARS">0-2 Years</option>
                <option value="2-5_YEARS">2-5 Years</option>
                <option value="5+_YEARS">5+ Years</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g. ₹4-8 LPA"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label>Company</label>

            {loadingCompanies ? (
              <p>Loading your companies...</p>
            ) : companies.length === 0 ? (
              <div style={styles.noCompany}>
                <p>You don't have any company yet.</p>

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => navigate("/recruiter/companies/create")}
                >
                  Create Company
                </button>
              </div>
            ) : (
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Your Company</option>

                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => navigate("/recruiter")}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={styles.submitButton}
              disabled={loadingCompanies || companies.length === 0}
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  card: {
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "30px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
    flex: 1,
  },

  row: {
    display: "flex",
    gap: "20px",
  },

  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#fff",
  },

  textarea: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  noCompany: {
    background: "#f3f4f6",
    padding: "15px",
    borderRadius: "8px",
  },

  secondaryButton: {
    border: "none",
    background: "#4b5563",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "25px",
  },

  cancelButton: {
    border: "none",
    background: "#e5e7eb",
    color: "#374151",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  submitButton: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default CreateJob;
