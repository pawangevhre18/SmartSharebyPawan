import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Link2 } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartsharebypawan.onrender.com";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.username.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const cleanUsername = form.username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

    if (!cleanUsername) {
      setError("Please enter a valid username.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            username: cleanUsername,
            password: form.password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          data.message ||
            `Signup failed. Server returned ${response.status}.`
        );
        return;
      }

      if (data.token) {
        localStorage.setItem(
          "smartshareToken",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "smartshareUser",
          JSON.stringify(data.user)
        );
      }

      // After successful signup
      navigate("/create-profile");

    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Unable to connect to SmartShare server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* LOGO */}

        <Link to="/" className="auth-logo">
          <div className="logo-icon">
            <Link2 size={19} />
          </div>

          <span>SmartShare</span>
        </Link>

        {/* HEADING */}

        <div className="auth-heading">
          <h1>Create your account</h1>

          <p>
            Join SmartShare and create your digital identity.
          </p>
        </div>

        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Pawan Gurjar"
            autoComplete="name"
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label>Username</label>

          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="pawangurjar"
            autoComplete="username"
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter password again"
            autoComplete="new-password"
          />

          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "14px",
                margin: "4px 0",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}

            {!loading && (
              <ArrowRight size={17} />
            )}
          </button>

        </form>

        {/* FOOTER */}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Signup;