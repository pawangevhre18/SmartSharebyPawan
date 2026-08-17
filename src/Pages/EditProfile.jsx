import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Globe,
  Link2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function EditProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    role: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    image: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // CHECK LOGIN + LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("smartshareToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const savedProfile =
          localStorage.getItem("smartshareProfile");

        if (!savedProfile) {
          alert("Please create your profile first.");
          navigate("/create-profile");
          return;
        }

        const localProfile =
          JSON.parse(savedProfile);

        setProfile({
          name: localProfile.name || "",
          username: localProfile.username || "",
          role: localProfile.role || "",
          bio: localProfile.bio || "",
          website: localProfile.website || "",
          github: localProfile.github || "",
          linkedin: localProfile.linkedin || "",
          image:
            localProfile.image ||
            localProfile.imageUrl ||
            "",
        });

        setImagePreview(
          localProfile.image ||
            localProfile.imageUrl ||
            ""
        );
      } catch (error) {
        console.error(
          "Load profile error:",
          error
        );

        alert("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // ==========================================
  // HANDLE INPUT
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

    setNewImage(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!profile.username.trim()) {
      alert("Username is required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "name",
        profile.name.trim()
      );

      formData.append(
        "username",
        profile.username
          .trim()
          .toLowerCase()
      );

      formData.append(
        "role",
        profile.role.trim()
      );

      formData.append(
        "bio",
        profile.bio.trim()
      );

      formData.append(
        "website",
        profile.website.trim()
      );

      formData.append(
        "github",
        profile.github.trim()
      );

      formData.append(
        "linkedin",
        profile.linkedin.trim()
      );

      if (newImage) {
        formData.append(
          "image",
          newImage
        );
      }

      const response = await fetch(
        `${API_URL}/api/profiles`,
        {
          method: "POST",
          body: formData,
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update profile."
        );
        return;
      }

      // ==========================================
      // SAVE UPDATED PROFILE
      // ==========================================

      if (data.profile) {
        localStorage.setItem(
          "smartshareProfile",
          JSON.stringify(data.profile)
        );
      }

      alert("Profile updated successfully! ✅");

      navigate(
        `/profile/${profile.username
          .trim()
          .toLowerCase()}`
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      alert(
        "Unable to connect to SmartShare server."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="edit-profile-page">
        <div className="edit-loading-card">
          <h2>Loading profile...</h2>
          <p>Please wait.</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="edit-profile-page">

      <div className="edit-profile-container">

        {/* HEADER */}

        <div className="edit-profile-header">

          <button
            type="button"
            className="edit-back-button"
            onClick={() =>
              navigate(
                `/profile/${profile.username}`
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Profile
          </button>

          <div>
            <span className="edit-badge">
              SMARTSHARE
            </span>

            <h1>Edit Your Profile</h1>

            <p>
              Update your information and keep
              your SmartShare profile fresh.
            </p>
          </div>

        </div>

        {/* FORM */}

        <form
          className="edit-profile-form"
          onSubmit={handleUpdateProfile}
        >

          {/* LEFT */}

          <div className="edit-form-card">

            <h2>Profile Information</h2>

            <p className="edit-card-description">
              Update the information displayed
              on your public profile.
            </p>

            {/* IMAGE */}

            <div className="edit-image-section">

              <div className="edit-avatar">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                  />
                ) : (
                  "PG"
                )}

              </div>

              <div className="edit-image-info">

                <strong>
                  Profile Photo
                </strong>

                <span>
                  JPG, PNG or WEBP. Maximum 5MB.
                </span>

                <label
                  htmlFor="edit-profile-image"
                  className="edit-upload-button"
                >
                  <Upload size={16} />
                  Change Photo
                </label>

                <input
                  id="edit-profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    display: "none",
                  }}
                />

              </div>

            </div>

            {/* NAME */}

            <div className="edit-form-group">

              <label>
                Full Name
              </label>

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your name"
              />

            </div>

            {/* USERNAME */}

            <div className="edit-form-group">

              <label>
                Username
              </label>

              <div className="edit-username-input">

                <span>
                  smartshare/
                </span>

                <input
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  placeholder="username"
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="edit-form-group">

              <label>
                Profession
              </label>

              <input
                name="role"
                value={profile.role}
                onChange={handleChange}
                placeholder="Frontend Developer"
              />

            </div>

            {/* BIO */}

            <div className="edit-form-group">

              <label>
                Bio
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell people about yourself..."
                rows="5"
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="edit-form-card">

            <h2>Social Links</h2>

            <p className="edit-card-description">
              Add your professional links so
              people can connect with you.
            </p>

            {/* WEBSITE */}

            <div className="edit-form-group">

              <label>
                Website
              </label>

              <div className="edit-input-icon">

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

            <div className="edit-form-group">

              <label>
                GitHub
              </label>

              <div className="edit-input-icon">

                <Link2 size={17} />

                <input
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />

              </div>

            </div>

            {/* LINKEDIN */}

            <div className="edit-form-group">

              <label>
                LinkedIn
              </label>

              <div className="edit-input-icon">

                <Link2 size={17} />

                <input
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />

              </div>

            </div>

            {/* PREVIEW */}

            <div className="edit-preview-box">

              <span>
                PROFILE URL
              </span>

              <strong>
                /profile/{profile.username}
              </strong>

            </div>

            {/* BUTTONS */}

            <div className="edit-actions">

              <button
                type="button"
                className="edit-cancel-button"
                onClick={() =>
                  navigate(
                    `/profile/${profile.username}`
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-button"
                disabled={saving}
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </form>

      </div>

    </main>
  );
}

export default EditProfile;