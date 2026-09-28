import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>

          <span style={styles.badge}>
            🚀 Build Your Career
          </span>

          <h1 style={styles.heroTitle}>
            Find Your
            <span style={styles.highlight}>
              {" "}Dream Job
            </span>
          </h1>

          <p style={styles.heroText}>
            Discover exciting job opportunities, connect
            with great companies, and take the next step
            in your career.
          </p>

          <div style={styles.heroButtons}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs →
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>

        </div>

        <div style={styles.heroCard}>
          <div style={styles.iconCircle}>
            💼
          </div>

          <h3 style={styles.cardTitle}>
            Your Career Starts Here
          </h3>

          <p style={styles.cardText}>
            Explore opportunities from companies
            looking for talented professionals.
          </p>

          <div style={styles.stats}>
            <div>
              <strong>100+</strong>
              <span>Jobs</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Companies</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>
          Everything You Need
        </h2>

        <p style={styles.sectionSubtitle}>
          A simple platform for both job seekers and recruiters.
        </p>

        <div style={styles.featuresGrid}>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              🔎
            </div>

            <h3>Find Jobs</h3>

            <p>
              Search and filter job opportunities based
              on your skills, location, and experience.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              📄
            </div>

            <h3>Apply Easily</h3>

            <p>
              Submit applications and track your
              application status from one place.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              🏢
            </div>

            <h3>For Recruiters</h3>

            <p>
              Create companies, post jobs, and manage
              applications efficiently.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2>
          Ready to take the next step?
        </h2>

        <p>
          Start exploring opportunities today.
        </p>

        <button
          style={styles.ctaButton}
          onClick={() => navigate("/jobs")}
        >
          Explore Jobs
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          © 2026 JobPortal. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
  },

  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "80px 30px",
    display: "grid",
    gridTemplateColumns: "1.4fr 0.8fr",
    gap: "60px",
    alignItems: "center",
  },

  heroContent: {
    maxWidth: "650px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "58px",
    lineHeight: "1.1",
    color: "#111827",
  },

  highlight: {
    color: "#2563eb",
  },

  heroText: {
    marginTop: "22px",
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#6b7280",
    maxWidth: "580px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
    marginTop: "30px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "14px 24px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2563eb",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  heroCard: {
    background: "#111827",
    color: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
  },

  iconCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    marginBottom: "25px",
  },

  cardTitle: {
    fontSize: "24px",
    margin: "0 0 12px",
  },

  cardText: {
    color: "#d1d5db",
    lineHeight: "1.7",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "30px",
    paddingTop: "25px",
    borderTop: "1px solid #374151",
  },

  featuresSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "50px 30px 80px",
    textAlign: "center",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  sectionSubtitle: {
    color: "#6b7280",
    marginTop: "10px",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "25px",
    marginTop: "35px",
  },

  featureCard: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow:
      "0 5px 20px rgba(0, 0, 0, 0.06)",
  },

  featureIcon: {
    fontSize: "35px",
    marginBottom: "15px",
  },

  cta: {
    background: "#2563eb",
    color: "#ffffff",
    textAlign: "center",
    padding: "65px 20px",
  },

  ctaButton: {
    marginTop: "15px",
    padding: "13px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#2563eb",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  footer: {
    background: "#111827",
    color: "#9ca3af",
    textAlign: "center",
    padding: "20px",
    fontSize: "13px",
  },
};

export default Home;