import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Link2,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("smartshareToken");
  const isLoggedIn = Boolean(token);

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("smartshareToken");
    localStorage.removeItem("smartshareUser");
    localStorage.removeItem("smartshareProfile");

    setMobileMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* =====================================
            LOGO
        ====================================== */}

        <Link
          to="/"
          className="logo"
          onClick={closeMobileMenu}
        >
          <div className="logo-icon">
            <Link2 size={20} />
          </div>

          <span>SmartShare</span>
        </Link>

        {/* =====================================
            DESKTOP NAVIGATION
        ====================================== */}

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/features">
            Features
          </Link>

          <Link to="/templates">
            Templates
          </Link>

          <Link to="/pricing">
            Pricing
          </Link>

          {isLoggedIn && (
            <Link to="/create-profile">
              Create Profile
            </Link>
          )}

        </div>

        {/* =====================================
            DESKTOP RIGHT BUTTONS
        ====================================== */}

        <div className="nav-buttons">

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="login-btn"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="nav-cta"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/create-profile"
                className="profile-nav-btn"
              >
                <User size={16} />
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="nav-logout-btn"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

        </div>

        {/* =====================================
            MOBILE MENU BUTTON
        ====================================== */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen((prev) => !prev)
          }
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        {/* =====================================
            MOBILE MENU
        ====================================== */}

        {mobileMenuOpen && (
          <div className="mobile-nav-menu">

            <Link
              to="/"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            <Link
              to="/features"
              onClick={closeMobileMenu}
            >
              Features
            </Link>

            <Link
              to="/templates"
              onClick={closeMobileMenu}
            >
              Templates
            </Link>

            <Link
              to="/pricing"
              onClick={closeMobileMenu}
            >
              Pricing
            </Link>

            {isLoggedIn && (
              <Link
                to="/create-profile"
                onClick={closeMobileMenu}
              >
                Create Profile
              </Link>
            )}

            <div className="mobile-nav-divider" />

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="mobile-login-btn"
                  onClick={closeMobileMenu}
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="mobile-get-started-btn"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/create-profile"
                  className="mobile-profile-btn"
                  onClick={closeMobileMenu}
                >
                  <User size={17} />
                  Profile
                </Link>

                <button
                  type="button"
                  className="mobile-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;