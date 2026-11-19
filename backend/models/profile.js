const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        hobbies: {
            type: String,
            required: true,
            trim: true
        },
        profileImage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;