import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const goToDashboard = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "ADMIN") {
      navigate("/admin");
    } else if (user.role === "RECRUITER") {
      navigate("/recruiter");
    } else {
      navigate("/jobseeker");
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate("/")}>
        JobPortal
      </div>

      <div style={styles.links}>
        <button style={styles.linkButton} onClick={() => navigate("/jobs")}>
          Browse Jobs
        </button>

        {token && user?.role === "JOB_SEEKER" && (
          <button
            style={styles.linkButton}
            onClick={() => navigate("/jobseeker/applications")}
          >
            My Applications
          </button>
        )}

        {token && (
          <button style={styles.dashboardButton} onClick={goToDashboard}>
            Dashboard
          </button>
        )}

        {token && (
          <div style={styles.userSection}>
            <span style={styles.username}>{user?.username}</span>

            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        {!token && (
          <button style={styles.loginButton} onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "#111827",
    padding: "14px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
  },

  logo: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    cursor: "pointer",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#d1d5db",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
  },

  dashboardButton: {
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "8px",
  },

  username: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
  },

  logoutButton: {
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
  },

  loginButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Navbar;
