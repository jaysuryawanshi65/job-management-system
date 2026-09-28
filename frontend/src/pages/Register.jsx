import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "JOB_SEEKER",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/register", formData);

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>

        <p style={styles.subtitle}>
          Join our job management platform
        </p>

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Username</label>

            <input
              style={styles.input}
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Email</label>

            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Account Type</label>

            <select
              style={styles.input}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="JOB_SEEKER">
                Job Seeker
              </option>

              <option value="RECRUITER">
                Recruiter
              </option>
            </select>
          </div>

          <button
            style={styles.button}
            type="submit"
          >
            Create Account
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "28px",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "18px",
  },

  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },

  loginText: {
    textAlign: "center",
    marginTop: "25px",
    color: "#666",
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Register;