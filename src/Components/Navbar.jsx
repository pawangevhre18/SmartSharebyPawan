import { Link } from "react-router-dom";
import { Link2 } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Link2 size={20} />
          </div>

          <span>SmartShare</span>
        </Link>

        {/* Navigation */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/templates">Templates</Link>
          <Link to="/pricing">Pricing</Link>
        </div>

        {/* Buttons */}
        <div className="nav-buttons">

          {/* Login */}
          <Link
            to="/login"
            className="login-btn"
          >
            Log in
          </Link>

          {/* Signup */}
          <Link
            to="/signup"
            className="nav-cta"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;