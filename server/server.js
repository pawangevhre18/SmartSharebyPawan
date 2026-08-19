import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// ==========================================
// CONFIG
// ==========================================

const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "smartshare-development-secret";

// ==========================================
// CLOUDINARY
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// MULTER
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),
});

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// MONGODB
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// ==========================================
// USER SCHEMA
// ==========================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// ==========================================
// PROFILE SCHEMA
// ==========================================

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "SmartShare Backend is Running 🚀",
  });
});

// ==========================================
// AUTH TEST ROUTE
// ==========================================

app.get("/api/auth-test", (req, res) => {
  res.status(200).json({
    message: "AUTH ROUTES SERVER IS LIVE ✅",
  });
});

// ==========================================
// SIGNUP
// ==========================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    console.log("Signup request received");

    const {
      name,
      email,
      username,
      password,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        message:
          "Name, email, username and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }

    const cleanName = name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

    if (!cleanUsername) {
      return res.status(400).json({
        message: "Please enter a valid username.",
      });
    }

    // ========================================
    // CHECK EXISTING EMAIL
    // ========================================

    const existingEmail = await User.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        message:
          "An account with this email already exists.",
      });
    }

    // ========================================
    // CHECK EXISTING USERNAME
    // ========================================

    const existingUsername = await User.findOne({
      username: cleanUsername,
    });

    if (existingUsername) {
      return res.status(409).json({
        message:
          "This username is already taken.",
      });
    }

    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ========================================
    // CREATE USER
    // ========================================

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      username: cleanUsername,
      password: hashedPassword,
    });

    // ========================================
    // CREATE JWT
    // ========================================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "New user registered:",
      user.email
    );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      message: "Signup successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error.message
    );

    return res.status(500).json({
      message: "Signup failed.",
      error: error.message,
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // ========================================
    // FIND USER
    // ========================================

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    // ========================================
    // CHECK PASSWORD
    // ========================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    // ========================================
    // JWT
    // ========================================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "User logged in:",
      user.email
    );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      message: "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    return res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

// ==========================================
// SAVE PROFILE + IMAGE
// ==========================================

app.post(
  "/api/profiles",
  upload.single("image"),
  async (req, res) => {
    try {
      const profile = req.body;

      if (!profile.name || !profile.username) {
        return res.status(400).json({
          message:
            "Name and username are required.",
        });
      }

      let imageUrl = "";

      // ========================================
      // CLOUDINARY IMAGE UPLOAD
      // ========================================

      if (req.file) {
        const uploadResult =
          await new Promise(
            (resolve, reject) => {
              const stream =
                cloudinary.uploader.upload_stream(
                  {
                    folder:
                      "smartshare/profiles",
                    resource_type: "image",
                  },
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result);
                    }
                  }
                );

              stream.end(req.file.buffer);
            }
          );

        imageUrl =
          uploadResult.secure_url;

        console.log(
          "Image uploaded successfully"
        );
      }

      // ========================================
      // PROFILE DATA
      // ========================================

      const profileData = {
        name: profile.name.trim(),

        username:
          profile.username
            .trim()
            .toLowerCase(),

        role: profile.role || "",

        bio: profile.bio || "",

        website:
          profile.website || "",

        github:
          profile.github || "",

        linkedin:
          profile.linkedin || "",
      };

      // ========================================
      // ONLY UPDATE IMAGE IF NEW IMAGE EXISTS
      // ========================================

      if (imageUrl) {
        profileData.image = imageUrl;
      }

      // ========================================
      // SAVE / UPDATE PROFILE
      // ========================================

      const savedProfile =
        await Profile.findOneAndUpdate(
          {
            username:
              profileData.username,
          },
          profileData,
          {
            returnDocument: "after",
            upsert: true,
            runValidators: true,
          }
        );

      console.log(
        "Profile saved:",
        savedProfile.username
      );

      // ========================================
      // RESPONSE
      // ========================================

      return res.status(200).json({
        message:
          "Profile saved successfully.",

        profile: savedProfile,
      });
    } catch (error) {
      console.error(
        "Save profile error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to save profile.",

        error: error.message,
      });
    }
  }
);

// ==========================================
// GET PROFILE
// ==========================================

app.get(
  "/api/profiles/:username",
  async (req, res) => {
    try {
      const username =
        req.params.username
          .trim()
          .toLowerCase();

      const profile =
        await Profile.findOne({
          username,
        });

      if (!profile) {
        return res.status(404).json({
          message:
            "Profile not found.",
        });
      }

      return res.status(200).json(profile);
    } catch (error) {
      console.error(
        "Get profile error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to get profile.",

        error:
          error.message,
      });
    }
  }
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  console.log(
    `404 - Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    message: "Route not found.",
    method: req.method,
    path: req.originalUrl,
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `SmartShare server running on http://localhost:${PORT}`
  );
});