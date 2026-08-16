import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

dotenv.config();

const app = express();

// ===============================
// CLOUDINARY CONFIG
// ===============================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===============================
// MULTER CONFIG
// ===============================

const upload = multer({
  storage: multer.memoryStorage(),
});

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// ===============================
// PROFILE SCHEMA
// ===============================

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

    // IMPORTANT
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

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("SmartShare Backend is Running 🚀");
});

// ===============================
// SAVE PROFILE + IMAGE
// ===============================

app.post(
  "/api/profiles",
  upload.single("image"),
  async (req, res) => {
    try {
      const profile = req.body;

      // ===============================
      // VALIDATION
      // ===============================

      if (!profile.name || !profile.username) {
        return res.status(400).json({
          message: "Name and username are required",
        });
      }

      let imageUrl = "";

      // ===============================
      // UPLOAD IMAGE TO CLOUDINARY
      // ===============================

      if (req.file) {
        const uploadResult = await new Promise(
          (resolve, reject) => {
            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder: "smartshare/profiles",
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

        imageUrl = uploadResult.secure_url;

        console.log(
          "Image uploaded:",
          imageUrl
        );
      }

      // ===============================
      // DATA TO SAVE
      // ===============================

      const profileData = {
        name: profile.name,
        username: profile.username,
        role: profile.role || "",
        bio: profile.bio || "",
        website: profile.website || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        image: imageUrl,
      };

      // ===============================
      // SAVE TO MONGODB
      // ===============================

      const savedProfile =
        await Profile.findOneAndUpdate(
          {
            username: profile.username,
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

      console.log(
        "Saved image:",
        savedProfile.image
      );

      // ===============================
      // RESPONSE
      // ===============================

      res.status(200).json({
        message: "Profile saved successfully",
        profile: savedProfile,
      });
    } catch (error) {
      console.error(
        "Save profile error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to save profile",
        error: error.message,
      });
    }
  }
);

// ===============================
// GET PROFILE
// ===============================

app.get(
  "/api/profiles/:username",
  async (req, res) => {
    try {
      const profile =
        await Profile.findOne({
          username: req.params.username,
        });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      res.json(profile);
    } catch (error) {
      console.error(
        "Get profile error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to get profile",
        error: error.message,
      });
    }
  }
);

// ===============================
// SERVER
// ===============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `SmartShare server running on http://localhost:${PORT}`
  );
});