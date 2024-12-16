const mongoose = require('mongoose');

// Define the course progress schema using the Mongoose Schema constructor
const courseProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ],
    
}, { timestamps: true });

// Export the Mongoose model for the course progress schema
module.exports = mongoose.model("CourseProgress", courseProgressSchema);
