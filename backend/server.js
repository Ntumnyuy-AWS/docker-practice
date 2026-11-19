
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();


const mongoose = require("mongoose");

const Profile = require("./models/profile");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.error("MongoDB connection failed:", error));

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure image storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        cb(null, uniqueName);
    }
});

// Configure upload restrictions
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    }
});

// Test endpoint
app.get("/", (req, res) => {
    res.send("Profile Manager API is running!");
});


// Create a new profile
app.post("/api/profiles", upload.single("profileImage"), async (req, res) => {
    try {
        const { name, hobbies } = req.body;

        if (!name || !hobbies) {
            return res.status(400).json({
                message: "Name and hobbies are required."
            });
        }

        // TEMPORARY DATABASE DIAGNOSTICS
        console.log("Mongoose connection state:", mongoose.connection.readyState);
        console.log("Profile model connection state:", Profile.db.readyState);
        console.log("MongoDB host:", mongoose.connection.host);

        // Create new profile
        const newProfile = new Profile({
            name,
            hobbies,
            profileImage: req.file ? `/uploads/${req.file.filename}` : ""
        });

        const savedProfile = await newProfile.save();

        res.status(201).json({
            message: "Profile created successfully!",
            profile: savedProfile
        });

    } catch (error) {
        console.error("Profile creation error:", error);

        res.status(500).json({
            message: "Failed to create profile.",
            error: error.message
        });
    }
});


// Update an existing profile
app.put("/api/profiles/:id", async (req, res) => {
    try {
        const { name, hobbies } = req.body;

        if (!name || !hobbies) {
            return res.status(400).json({
                message: "Name and hobbies are required."
            });
        }

        const updatedProfile = await Profile.findByIdAndUpdate(
            req.params.id,
            {
                name,
                hobbies
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProfile) {
            return res.status(404).json({
                message: "Profile not found."
            });
        }

        res.status(200).json({
            message: "Profile updated successfully!",
            profile: updatedProfile
        });

    } catch (error) {
        console.error("Profile update error:", error);

        res.status(500).json({
            message: "Failed to update profile."
        });
    }
});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
