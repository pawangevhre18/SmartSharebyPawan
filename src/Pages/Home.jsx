import { ArrowRight, Check, Link2, QrCode, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <span>✦</span>
            Your digital identity, simplified
          </div>

          <h1>
            One Link.
            <br />
            <span>Everything You Are.</span>
          </h1>

          <p>
            Share your portfolio, social links, resume,
            contact information and more with one simple
            SmartShare link.
          </p>

          <div className="hero-buttons">

            <Link
              to="/create-profile"
              className="hero-primary"
            >
              Create Your Profile
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/features"
              className="hero-secondary"
            >
              Explore Features
            </Link>

          </div>

          <div className="hero-points">

            <div>
              <Check size={16} />
              Free to start
            </div>

            <div>
              <Check size={16} />
              No coding required
            </div>

          </div>

        </div>


        {/* Profile Preview */}
        <div className="hero-preview">

          <div className="profile-card">

            <div className="profile-cover"></div>

            <div className="profile-content">

              <div className="avatar">
                PG
              </div>

              <h3>Pawan Gurjar</h3>

              <p className="profile-role">
                Frontend Developer
              </p>

              <p className="profile-bio">
                Building digital experiences that
                people love to use.
              </p>

              <div className="social-icons">
                <span>in</span>
                <span>GH</span>
                <span>◎</span>
                <span>WA</span>
              </div>

              <button className="contact-button">
                Contact Me
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* Features Section */}
      <section className="features-section">

        <div className="section-heading">

          <span>WHY SMARTSHARE?</span>

          <h2>
            Everything you need
            <br />
            to share your world.
          </h2>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <Link2 size={22} />
            </div>

            <h3>One Smart Link</h3>

            <p>
              Put your important links, portfolio,
              resume and social profiles in one place.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <QrCode size={22} />
            </div>

            <h3>Instant QR Code</h3>

            <p>
              Generate your personal QR code and
              let people access your profile instantly.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <BarChart3 size={22} />
            </div>

            <h3>Simple Analytics</h3>

            <p>
              Track profile visits, link clicks and
              QR scans from your dashboard.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;