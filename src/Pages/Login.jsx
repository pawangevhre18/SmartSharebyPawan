import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Link2 } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
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

      // ==========================================
      // LOGIN FAILED
      // ==========================================

      if (!response.ok) {
        setError(
          data.message ||
            `Login failed. Server returned ${response.status}.`
        );

        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      if (data.token) {
        localStorage.setItem(
          "smartshareToken",
          data.token
        );
      }

      // ==========================================
      // SAVE USER
      // ==========================================

      if (data.user) {
        localStorage.setItem(
          "smartshareUser",
          JSON.stringify(data.user)
        );
      }

      console.log(
        "Login successful:",
        data
      );

      // ==========================================
      // GO TO CREATE PROFILE
      // ==========================================

      navigate("/create-profile", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to SmartShare server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="auth-page">

      <div className="auth-card">

        {/* LOGO */}

        <Link
          to="/"
          className="auth-logo"
        >
          <div className="logo-icon">
            <Link2 size={19} />
          </div>

          <span>
            SmartShare
          </span>
        </Link>

        {/* HEADING */}

        <div className="auth-heading">

          <h1>
            Welcome back
          </h1>

          <p>
            Log in to manage your
            SmartShare profile.
          </p>

        </div>

        {/* LOGIN FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
          />

          {/* PASSWORD */}

          <label>
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {/* ERROR */}

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

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Log in"}

            {!loading && (
              <ArrowRight size={17} />
            )}

          </button>

        </form>

        {/* SIGNUP */}

        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/signup">
            Create one
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;