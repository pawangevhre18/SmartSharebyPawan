import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// Profile Schema
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
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("SmartShare Backend is Running 🚀");
});

// SAVE PROFILE
app.post("/api/profiles", async (req, res) => {
  try {
    const profile = req.body;

    if (!profile.name || !profile.username) {
      return res.status(400).json({
        message: "Name and username are required",
      });
    }

    const savedProfile = await Profile.findOneAndUpdate(
      { username: profile.username },
      profile,
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    console.log("Profile saved:", savedProfile.username);

    res.status(200).json({
      message: "Profile saved successfully",
      profile: savedProfile,
    });
  } catch (error) {
    console.error("Save profile error:", error.message);

    res.status(500).json({
      message: "Failed to save profile",
      error: error.message,
    });
  }
});

// GET PROFILE
app.get("/api/profiles/:username", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      username: req.params.username,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error.message);

    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SmartShare server running on http://localhost:${PORT}`);
});