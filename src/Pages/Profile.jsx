import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Link2,
  Globe,
  Share2,
  Copy,
  Check,
  Download,
  Edit3,
  X,
  Save,
  Upload,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// ==========================================
// SMARTSHARE BACKEND
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// ==========================================
// SMARTSHARE FRONTEND
// ==========================================

const FRONTEND_URL =
  "https://smart-shareby-pawan.vercel.app";

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // EDIT STATES
  // ==========================================

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    role: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    image: null,
  });

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/profiles/${username}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Profile not found."
          );
          return;
        }

        console.log("PROFILE DATA:", data);

        setProfile(data);

        // Save latest profile locally
        localStorage.setItem(
          "smartshareProfile",
          JSON.stringify(data)
        );

        // Set edit form
        setEditForm({
          name: data.name || "",
          username: data.username || "",
          role: data.role || "",
          bio: data.bio || "",
          website: data.website || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          image: null,
        });
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error
        );

        setError(
          "Unable to connect to SmartShare server."
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // ==========================================
  // HANDLE EDIT INPUT
  // ==========================================

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // HANDLE EDIT IMAGE
  // ==========================================

  const handleEditImage = (e) => {
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

    setEditForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const handleStartEdit = () => {
    setEditForm({
      name: profile.name || "",
      username: profile.username || "",
      role: profile.role || "",
      bio: profile.bio || "",
      website: profile.website || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      image: null,
    });

    setEditing(true);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setEditing(false);

    setEditForm({
      name: profile.name || "",
      username: profile.username || "",
      role: profile.role || "",
      bio: profile.bio || "",
      website: profile.website || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      image: null,
    });
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!editForm.username.trim()) {
      alert("Please enter a username.");
      return;
    }

    const cleanUsername = editForm.username
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

      const formData = new FormData();

      formData.append(
        "name",
        editForm.name.trim()
      );

      formData.append(
        "username",
        cleanUsername
      );

      formData.append(
        "role",
        editForm.role.trim()
      );

      formData.append(
        "bio",
        editForm.bio.trim()
      );

      formData.append(
        "website",
        editForm.website.trim()
      );

      formData.append(
        "github",
        editForm.github.trim()
      );

      formData.append(
        "linkedin",
        editForm.linkedin.trim()
      );

      if (editForm.image) {
        formData.append(
          "image",
          editForm.image
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
        console.error(
          "Update profile error:",
          data
        );

        alert(
          data.message ||
            "Failed to update profile."
        );

        return;
      }

      console.log(
        "Profile updated:",
        data.profile
      );

      if (data.profile) {
        setProfile(data.profile);

        localStorage.setItem(
          "smartshareProfile",
          JSON.stringify(data.profile)
        );
      }

      setEditing(false);

      // If username changed
      if (
        data.profile &&
        data.profile.username !== username
      ) {
        navigate(
          `/profile/${data.profile.username}`,
          {
            replace: true,
          }
        );
      }
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
      <main className="public-profile-page">
        <div className="public-profile-card">
          <div className="public-profile-content">
            <h2>Loading profile...</h2>

            <p>Please wait.</p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !profile) {
    return (
      <main className="public-profile-page">
        <div className="public-profile-card">
          <div className="public-profile-content">
            <h2>Profile Not Found</h2>

            <p>
              {error ||
                "This SmartShare profile does not exist."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // PROFILE URL
  // ==========================================

  const profileUrl =
    `${FRONTEND_URL}/profile/${profile.username}`;

  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================
  // SOCIAL URL
  // ==========================================

  const getSocialUrl = (url) => {
    if (!url) return "";

    return url.startsWith("http")
      ? url
      : `https://${url}`;
  };

  // ==========================================
  // COPY PROFILE LINK
  // ==========================================

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        profileUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy:",
        error
      );
    }
  };

  // ==========================================
  // SHARE PROFILE
  // ==========================================

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title:
            `${profile.name} | SmartShare`,

          text:
            `Check out ${profile.name}'s SmartShare profile.`,

          url: profileUrl,
        });
      } catch {
        console.log(
          "Share cancelled"
        );
      }
    } else {
      handleCopy();
    }
  };

  // ==========================================
  // DOWNLOAD QR
  // ==========================================

  const handleDownloadQR = () => {
    const svg =
      document.getElementById(
        "smartshare-qr"
      );

    if (!svg) return;

    const svgData =
      new XMLSerializer()
        .serializeToString(svg);

    const canvas =
      document.createElement("canvas");

    const ctx =
      canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;

      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        img,
        50,
        50,
        500,
        500
      );

      const pngUrl =
        canvas.toDataURL("image/png");

      const downloadLink =
        document.createElement("a");

      downloadLink.href = pngUrl;

      downloadLink.download =
        `${profile.username}-smartshare-qr.png`;

      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(
        unescape(
          encodeURIComponent(svgData)
        )
      );
  };

  // ==========================================
  // SHARE QR
  // ==========================================

  const handleShareQR = async () => {
    const svg =
      document.getElementById(
        "smartshare-qr"
      );

    if (!svg) return;

    const svgData =
      new XMLSerializer()
        .serializeToString(svg);

    const blob = new Blob(
      [svgData],
      {
        type: "image/svg+xml",
      }
    );

    const file = new File(
      [blob],
      `${profile.username}-smartshare-qr.svg`,
      {
        type: "image/svg+xml",
      }
    );

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file],
      })
    ) {
      try {
        await navigator.share({
          title:
            `${profile.name} | SmartShare`,

          text:
            "Scan my SmartShare profile QR",

          files: [file],
        });
      } catch {
        console.log(
          "QR share cancelled"
        );
      }
    } else {
      handleDownloadQR();
    }
  };

  // ==========================================
  // EDIT MODE
  // ==========================================

  if (editing) {
    return (
      <main className="edit-profile-page">

        <div className="edit-profile-card">

          <div className="edit-profile-header">

            <div>
              <span className="edit-badge">
                SMARTSHARE
              </span>

              <h1>
                Edit Profile
              </h1>

              <p>
                Update your SmartShare information.
              </p>
            </div>

            <button
              type="button"
              className="edit-close-button"
              onClick={handleCancelEdit}
            >
              <X size={20} />
            </button>

          </div>

          <div className="edit-profile-form">

            {/* PHOTO */}

            <div className="edit-photo-section">

              <div className="edit-avatar">

                {editForm.image ? (
                  <img
                    src={URL.createObjectURL(
                      editForm.image
                    )}
                    alt="Preview"
                  />
                ) : profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                  />
                ) : (
                  getInitials(
                    editForm.name
                  )
                )}

              </div>

              <label
                htmlFor="edit-profile-image"
                className="edit-photo-button"
              >
                <Upload size={17} />

                Change Photo
              </label>

              <input
                id="edit-profile-image"
                type="file"
                accept="image/*"
                onChange={handleEditImage}
                style={{
                  display: "none",
                }}
              />

            </div>

            {/* NAME */}

            <div className="edit-form-group">

              <label>Full Name</label>

              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Your name"
              />

            </div>

            {/* USERNAME */}

            <div className="edit-form-group">

              <label>Username</label>

              <div className="edit-username-input">

                <span>smartshare/</span>

                <input
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  placeholder="username"
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="edit-form-group">

              <label>Profession</label>

              <input
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                placeholder="Frontend Developer"
              />

            </div>

            {/* BIO */}

            <div className="edit-form-group">

              <label>Bio</label>

              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                rows="4"
                placeholder="Tell people about yourself..."
              />

            </div>

            {/* WEBSITE */}

            <div className="edit-form-group">

              <label>Website</label>

              <div className="edit-input-icon">

                <Globe size={17} />

                <input
                  name="website"
                  value={editForm.website}
                  onChange={handleEditChange}
                  placeholder="https://yourwebsite.com"
                />

              </div>

            </div>

            {/* GITHUB */}

            <div className="edit-form-group">

              <label>GitHub</label>

              <div className="edit-input-icon">

                <Link2 size={17} />

                <input
                  name="github"
                  value={editForm.github}
                  onChange={handleEditChange}
                  placeholder="GitHub profile URL"
                />

              </div>

            </div>

            {/* LINKEDIN */}

            <div className="edit-form-group">

              <label>LinkedIn</label>

              <div className="edit-input-icon">

                <Link2 size={17} />

                <input
                  name="linkedin"
                  value={editForm.linkedin}
                  onChange={handleEditChange}
                  placeholder="LinkedIn profile URL"
                />

              </div>

            </div>

            {/* ACTIONS */}

            <div className="edit-profile-actions">

              <button
                type="button"
                className="edit-cancel-button"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <X size={17} />

                Cancel
              </button>

              <button
                type="button"
                className="edit-save-button"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={17} />

                    Save Changes
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================
  // PUBLIC PROFILE UI
  // ==========================================

  return (
    <main className="public-profile-page">

      <div className="public-profile-card">

        {/* COVER */}

        <div className="public-cover"></div>

        <div className="public-profile-content">

          {/* EDIT BUTTON */}

          <button
            type="button"
            className="profile-edit-button"
            onClick={handleStartEdit}
          >
            <Edit3 size={17} />

            Edit Profile
          </button>

          {/* AVATAR */}

          <div className="public-avatar">

            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
              />
            ) : (
              getInitials(profile.name)
            )}

          </div>

          {/* NAME */}

          <h1>
            {profile.name}
          </h1>

          {/* USERNAME */}

          <p className="public-username">
            @{profile.username}
          </p>

          {/* ROLE */}

          <p className="public-role">
            {profile.role}
          </p>

          {/* BIO */}

          <p className="public-bio">
            {profile.bio}
          </p>

          {/* SOCIAL LINKS */}

          <div className="public-links">

            {profile.website && (
              <a
                href={getSocialUrl(
                  profile.website
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Globe size={17} />

                Website
              </a>
            )}

            {profile.github && (
              <a
                href={getSocialUrl(
                  profile.github
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Link2 size={17} />

                GitHub
              </a>
            )}

            {profile.linkedin && (
              <a
                href={getSocialUrl(
                  profile.linkedin
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Link2 size={17} />

                LinkedIn
              </a>
            )}

          </div>

          {/* SHARE */}

          <div className="profile-share-actions">

            <button
              type="button"
              className="share-profile-button"
              onClick={handleShare}
            >
              <Share2 size={17} />

              Share Profile
            </button>

            <button
              type="button"
              className="copy-profile-button"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={17} />

                  Copied!
                </>
              ) : (
                <>
                  <Copy size={17} />

                  Copy Link
                </>
              )}
            </button>

          </div>

          {/* QR */}

          <div className="profile-qr-section">

            <h3>
              Scan to view profile
            </h3>

            <div className="profile-qr-box">

              <QRCodeSVG
                id="smartshare-qr"
                value={profileUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#111827"
                level="H"
              />

            </div>

            <p>
              Scan this QR code to open
              <br />
              this SmartShare profile.
            </p>

            <div className="qr-actions">

              <button
                type="button"
                onClick={handleDownloadQR}
                className="qr-download-button"
              >
                <Download size={16} />

                Download QR
              </button>

              <button
                type="button"
                onClick={handleShareQR}
                className="qr-share-button"
              >
                <Share2 size={16} />

                Share QR
              </button>

            </div>

          </div>

          {/* CONTACT */}

          <button
            type="button"
            className="public-contact"
          >
            Contact Me
          </button>

          {/* BRAND */}

          <div className="smartshare-brand">

            <Link2 size={14} />

            SmartShare

          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;