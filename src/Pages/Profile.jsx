
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Link2,
  Globe,
  Share2,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// ==========================================
// SMARTSHARE BACKEND
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartsharebypawan.onrender.com";

// ==========================================
// SMARTSHARE PRODUCTION URL
// ==========================================

const FRONTEND_URL =
  "https://smart-shareby-pawan.vercel.app";

function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        console.log(
          "PROFILE DATA:",
          data
        );

        console.log(
          "IMAGE URL:",
          data.imageUrl
        );

        setProfile(data);

        localStorage.setItem(
          "smartshareProfile",
          JSON.stringify(data)
        );

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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="public-profile-page">

        <div className="public-profile-card">

          <div className="public-profile-content">

            <h2>
              Loading profile...
            </h2>

            <p>
              Please wait.
            </p>

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

            <h2>
              Profile Not Found
            </h2>

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
  // PRODUCTION PROFILE URL
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
        "Failed to copy link:",
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

      } catch (error) {

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
      document.createElement(
        "canvas"
      );

    const ctx =
      canvas.getContext("2d");

    const img =
      new Image();

    img.onload = () => {

      canvas.width = 600;
      canvas.height = 600;

      ctx.fillStyle =
        "#ffffff";

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
        canvas.toDataURL(
          "image/png"
        );

      const downloadLink =
        document.createElement(
          "a"
        );

      downloadLink.href =
        pngUrl;

      downloadLink.download =
        `${profile.username}-smartshare-qr.png`;

      downloadLink.click();

    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(
        unescape(
          encodeURIComponent(
            svgData
          )
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

    const blob =
      new Blob(
        [svgData],
        {
          type:
            "image/svg+xml",
        }
      );

    const file =
      new File(
        [blob],
        `${profile.username}-smartshare-qr.svg`,
        {
          type:
            "image/svg+xml",
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

      } catch (error) {

        console.log(
          "QR share cancelled"
        );

      }

    } else {

      handleDownloadQR();

    }
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
  // UI
  // ==========================================

  return (
    <main className="public-profile-page">

      <div className="public-profile-card">

        {/* COVER */}

        <div className="public-cover"></div>

        <div className="public-profile-content">

          {/* AVATAR */}

          <div className="public-avatar">

            {profile.imageUrl ? (

              <img
                src={profile.imageUrl}
                alt={profile.name}
              />

            ) : (

              getInitials(
                profile.name
              )

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

          {/* SHARE ACTIONS */}

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

          {/* QR CODE */}

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
                onClick={
                  handleDownloadQR
                }
                className="qr-download-button"
              >

                <Download size={16} />

                Download QR

              </button>

              <button
                type="button"
                onClick={
                  handleShareQR
                }
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
