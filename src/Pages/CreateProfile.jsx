
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Link2,
  Globe,
  Upload,
} from "lucide-react";

// ==========================================
// SMARTSHARE BACKEND
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartsharebypawan.onrender.com";

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
    image: null,
  });

  const [saving, setSaving] = useState(false);

  // ==========================================
  // HANDLE TEXT INPUT
  // ==========================================

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // HANDLE IMAGE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // ==========================================
  // CREATE PROFILE
  // ==========================================

  const handleCreateProfile = async () => {
    if (!profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!profile.username.trim()) {
      alert("Please enter a username.");
      return;
    }

    const cleanUsername = profile.username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

    if (!cleanUsername) {
      alert("Please enter a valid username.");
      return;
    }

    try {
      setSaving(true);

      // ==========================================
      // CREATE FORMDATA
      // ==========================================

      const formData = new FormData();

      formData.append("name", profile.name.trim());
      formData.append("username", cleanUsername);
      formData.append("role", profile.role.trim());
      formData.append("bio", profile.bio.trim());
      formData.append("website", profile.website.trim());
      formData.append("github", profile.github.trim());
      formData.append("linkedin", profile.linkedin.trim());

      if (profile.image) {
        formData.append("image", profile.image);
      }

      // ==========================================
      // SEND TO RENDER BACKEND
      // ==========================================

      const response = await fetch(API_URL + "/api/profiles", {
        method: "POST",
        body: formData,
      });

      // Try to read JSON safely
      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        console.warn("Unable to parse JSON response:", error);
        data = {};
      }

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      if (!response.ok) {
        console.error("Backend error:", data);

        alert(
          data.message ||
            "Failed to save profile. Server returned " + response.status + "."
        );

        return;
      }

      console.log(
        "Profile saved successfully:",
        data.profile
      );

      // ==========================================
      // SAVE PROFILE LOCALLY
      // ==========================================

      if (data.profile) {
        localStorage.setItem(
          "smartshareProfile",
          JSON.stringify(data.profile)
        );
      }

      // ==========================================
      // OPEN PUBLIC PROFILE
      // ==========================================

      const profilePath = "/profile/" + cleanUsername;
      navigate(profilePath);
      return;
    } catch (error) {
      console.error(
        "Create profile error:",
        error
      );

      alert(
        "Unable to connect to SmartShare server. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // IMAGE PREVIEW
  // ==========================================

  const imagePreview = profile.image
    ? URL.createObjectURL(profile.image)
    : null;

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
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProfile();
          }}
        >

          {/* PROFILE PHOTO */}

          <div className="form-group">

            <label>Profile Photo</label>

            <div className="profile-photo-upload">

              <label
                htmlFor="profile-image"
                className="photo-upload-button"
              >
                <Upload size={18} />

                {profile.image
                  ? "Change Photo"
                  : "Upload Photo"}
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {profile.image && (
                <span className="selected-photo-name">
                  {profile.image.name}
                </span>
              )}

            </div>

          </div>

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
            type="submit"
            className="create-profile-button"
            disabled={saving}
          >
            {saving
              ? "Creating Profile..."
              : "Create SmartShare"}

            {!saving && (
              <ArrowRight size={18} />
            )}

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

            {/* AVATAR */}

            <div className="preview-avatar">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                />
              ) : (
                "PG"
              )}

            </div>

            {/* NAME */}

            <h2>
              {profile.name}
            </h2>

            {/* ROLE */}

            <p className="preview-role">
              {profile.role}
            </p>

            {/* BIO */}

            <p className="preview-bio">
              {profile.bio}
            </p>

            {/* LINKS */}

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

            {/* CONTACT */}

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

