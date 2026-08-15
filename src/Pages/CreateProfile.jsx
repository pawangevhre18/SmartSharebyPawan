import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Link2,
  Globe,
} from "lucide-react";

function CreateProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Pawan Gurjar",
    username: "pawangurjar",
    role: "Frontend Developer",
    bio: "Building digital experiences that people love to use.",
    website: "",
    github: "",
    linkedin: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProfile = async () => {
    // NAME VALIDATION
    if (!profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    // USERNAME VALIDATION
    if (!profile.username.trim()) {
      alert("Please enter a username.");
      return;
    }

    const cleanUsername = profile.username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const updatedProfile = {
      ...profile,
      username: cleanUsername,
    };

    try {
      // SAVE PROFILE TO LIVE BACKEND
      const response = await fetch(
        "https://smartsharebypawan.onrender.com/api/profiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create profile.");
        return;
      }

      // KEEP LOCAL COPY
      localStorage.setItem(
        "smartshareProfile",
        JSON.stringify(updatedProfile)
      );

      console.log("Profile saved successfully:", data.profile);

      // OPEN PROFILE PAGE
      navigate(`/profile/${cleanUsername}`);

    } catch (error) {
      console.error("Create profile error:", error);

      alert(
        "Unable to connect to SmartShare server. Please try again."
      );
    }
  };

  return (
    <main className="create-profile-page">

      {/* LEFT SIDE */}

      <section className="profile-form-section">

        <div className="form-heading">

          <span className="page-badge">
            CREATE YOUR PROFILE
          </span>

          <h1>
            Build your
            <span> SmartShare.</span>
          </h1>

          <p>
            Add your information and create your
            digital identity in one place.
          </p>

        </div>

        <form
          className="profile-form"
          onSubmit={(e) => e.preventDefault()}
        >

          {/* NAME */}

          <div className="form-group">

            <label>Full Name</label>

            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your name"
            />

          </div>

          {/* USERNAME */}

          <div className="form-group">

            <label>Username</label>

            <div className="username-input">

              <span>smartshare/</span>

              <input
                name="username"
                value={profile.username}
                onChange={handleChange}
                placeholder="username"
              />

            </div>

          </div>

          {/* PROFESSION */}

          <div className="form-group">

            <label>Profession</label>

            <input
              name="role"
              value={profile.role}
              onChange={handleChange}
              placeholder="Frontend Developer"
            />

          </div>

          {/* BIO */}

          <div className="form-group">

            <label>Bio</label>

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell people about yourself..."
              rows="4"
            />

          </div>

          {/* WEBSITE */}

          <div className="form-group">

            <label>Website</label>

            <div className="input-with-icon">

              <Globe size={17} />

              <input
                name="website"
                value={profile.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />

            </div>

          </div>

          {/* GITHUB */}

          <div className="form-group">

            <label>GitHub</label>

            <div className="input-with-icon">

              <Link2 size={17} />

              <input
                name="github"
                value={profile.github}
                onChange={handleChange}
                placeholder="GitHub profile URL"
              />

            </div>

          </div>

          {/* LINKEDIN */}

          <div className="form-group">

            <label>LinkedIn</label>

            <div className="input-with-icon">

              <Link2 size={17} />

              <input
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn profile URL"
              />

            </div>

          </div>

          {/* CREATE BUTTON */}

          <button
            type="button"
            className="create-profile-button"
            onClick={handleCreateProfile}
          >
            Create SmartShare
            <ArrowRight size={18} />
          </button>

        </form>

      </section>

      {/* RIGHT SIDE */}

      <section className="profile-preview-section">

        <div className="preview-label">
          LIVE PREVIEW
        </div>

        <div className="profile-preview-card">

          <div className="preview-cover"></div>

          <div className="preview-content">

            <div className="preview-avatar">
              PG
            </div>

            <h2>{profile.name}</h2>

            <p className="preview-role">
              {profile.role}
            </p>

            <p className="preview-bio">
              {profile.bio}
            </p>

            <div className="preview-links">

              {profile.website && (
                <div>
                  <Globe size={16} />
                  Website
                </div>
              )}

              {profile.github && (
                <div>
                  <Link2 size={16} />
                  GitHub
                </div>
              )}

              {profile.linkedin && (
                <div>
                  <Link2 size={16} />
                  LinkedIn
                </div>
              )}

            </div>

            <button
              type="button"
              className="preview-contact"
            >
              Contact Me
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

export default CreateProfile;