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
    },

    username: {
      type: String,
      required: true,
      unique: true,
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

const Profile = mongoose.model(
  "Profile",
  profileSchema
);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "SmartShare Backend is Running 🚀",
  });
});

// ==========================================
// SIGNUP
// ==========================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    // JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
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

    res.status(201).json({
      message: "Signup successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error.message
    );

    res.status(500).json({
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    // Check password
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

    // JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
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

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
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

      // Upload image
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
          "Image uploaded:",
          imageUrl
        );
      }

      const profileData = {
        name: profile.name.trim(),
        username:
          profile.username.trim().toLowerCase(),
        role: profile.role || "",
        bio: profile.bio || "",
        website: profile.website || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
      };

      // Only replace image when new image exists
      if (imageUrl) {
        profileData.image = imageUrl;
      }

      const savedProfile =
        await Profile.findOneAndUpdate(
          {
            username: profileData.username,
          },
          profileData,
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      console.log(
        "Profile saved:",
        savedProfile.username
      );

      res.status(200).json({
        message:
          "Profile saved successfully.",
        profile: savedProfile,
      });
    } catch (error) {
      console.error(
        "Save profile error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to save profile.",
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

      res.json(profile);
    } catch (error) {
      console.error(
        "Get profile error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to get profile.",
        error: error.message,
      });
    }
  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `SmartShare server running on http://localhost:${PORT}`
  );
});