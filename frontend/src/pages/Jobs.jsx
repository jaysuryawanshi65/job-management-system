import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/job", {
        params: filters,
      });

      setJobs(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClear = () => {
    const emptyFilters = {
      keyword: "",
      location: "",
      employmentType: "",
      experienceLevel: "",
    };

    setFilters(emptyFilters);

    setTimeout(() => {
      fetchJobs();
    }, 0);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Find Your Next Job</h1>

          <p style={styles.subtitle}>
            Search and explore available job opportunities
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            style={styles.dashboardButton}
            onClick={() => navigate("/jobseeker")}
          >
            Dashboard
          </button>

          <button
            style={styles.logoutButton}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={styles.container}>
        {/* Search / Filters */}
        <div style={styles.filterCard}>
          <form onSubmit={handleSearch} style={styles.filterForm}>
            <input
              style={styles.searchInput}
              type="text"
              name="keyword"
              placeholder="Search job title or keyword"
              value={filters.keyword}
              onChange={handleChange}
            />

            <input
              style={styles.searchInput}
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
            />

            <select
              style={styles.select}
              name="employmentType"
              value={filters.employmentType}
              onChange={handleChange}
            >
              <option value="">Employment Type</option>

              <option value="Full-Time">Full-Time</option>

              <option value="Part-Time">Part-Time</option>

              <option value="Contract">Contract</option>

              <option value="Internship">Internship</option>
            </select>

            <select
              style={styles.select}
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleChange}
            >
              <option value="">Experience Level</option>

              <option value="Fresher">Fresher</option>

              <option value="Junior">Junior</option>

              <option value="Mid-Level">Mid-Level</option>

              <option value="Senior">Senior</option>
            </select>

            <button type="submit" style={styles.searchButton}>
              Search
            </button>

            <button
              type="button"
              style={styles.clearButton}
              onClick={handleClear}
            >
              Clear
            </button>
          </form>
        </div>

        {/* Jobs Header */}
        <div style={styles.jobsHeader}>
          <div>
            <h2 style={styles.jobsTitle}>Available Jobs</h2>

            <p style={styles.jobsCount}>
              {jobs.length} job
              {jobs.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && <div style={styles.centerMessage}>Loading jobs...</div>}

        {/* Error */}
        {!loading && error && <div style={styles.error}>{error}</div>}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <div style={styles.empty}>
            <h3>No jobs found</h3>

            <p>Try changing your search or filters.</p>
          </div>
        )}

        {/* Jobs */}
        {!loading && !error && jobs.length > 0 && (
          <div style={styles.jobsGrid}>
            {jobs.map((job) => (
              <div key={job.id} style={styles.jobCard}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>

                  <p style={styles.company}>🏢 {job.company}</p>

                  <div style={styles.details}>
                    <span>📍 {job.location}</span>

                    <span>💼 {job.employmentType}</span>

                    <span>🎓 {job.experienceLevel}</span>
                  </div>

                  <p style={styles.salary}>💰 {job.salaryRange}</p>

                  <p style={styles.description}>
                    {job.description.length > 160
                      ? `${job.description.substring(0, 160)}...`
                      : job.description}
                  </p>
                </div>

                <button
                  style={styles.viewButton}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  View Details
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

  headerActions: {
    display: "flex",
    gap: "10px",
  },

  dashboardButton: {
    padding: "10px 16px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2563eb",
    cursor: "pointer",
  },

  logoutButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 20px",
  },

  filterCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  filterForm: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 1fr 1fr auto auto",
    gap: "10px",
  },

  searchInput: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },

  select: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#ffffff",
    outline: "none",
  },

  searchButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
  },

  clearButton: {
    padding: "12px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },

  jobsHeader: {
    marginTop: "35px",
    marginBottom: "20px",
  },

  jobsTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#111827",
  },

  jobsCount: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  jobsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  jobCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "300px",
  },

  jobTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#111827",
  },

  company: {
    margin: "8px 0 15px",
    color: "#4b5563",
    fontSize: "14px",
  },

  details: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    color: "#6b7280",
    fontSize: "13px",
  },

  salary: {
    margin: "15px 0",
    fontWeight: "600",
    color: "#166534",
  },

  description: {
    color: "#6b7280",
    lineHeight: "1.6",
    fontSize: "14px",
  },

  viewButton: {
    marginTop: "20px",
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },

  centerMessage: {
    textAlign: "center",
    padding: "50px",
    color: "#6b7280",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px",
    textAlign: "center",
  },

  empty: {
    background: "#ffffff",
    padding: "50px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#6b7280",
  },
};

export default Jobs;
