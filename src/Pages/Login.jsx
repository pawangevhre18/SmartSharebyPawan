import { Link } from "react-router-dom";
import { ArrowRight, Link2 } from "lucide-react";

function Login() {
  return (
    <main className="auth-page">

      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <div className="logo-icon">
            <Link2 size={19} />
          </div>

          <span>SmartShare</span>
        </Link>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>
            Log in to manage your SmartShare profile.
          </p>
        </div>

        <form className="auth-form">

          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit" className="auth-button">
            Log in
            <ArrowRight size={17} />
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/create-profile">
            Create one
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Login;