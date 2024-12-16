const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const { convertSecondsToDuration} = require("../utils/secToDuration");
const { calculateBMI, calculateDailyRequiredCalories } = require("../utils/calculations");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Method for updating a profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName,lastName,height, weight, age, gender, activityLevel } = req.body;

        // if (!age || !gender) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Age and gender are required fields.",
        //     });
        // }
        if(!firstName || !lastName){
            return res.status(400).json({
                success: false,
                message: "First Name and Last Name are required fields.",
            })
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.gender=gender || user.gender;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        user.age = age || user.age;
        user.activityLevel = activityLevel || user.activityLevel;

        if (user.height && user.weight) {
            user.bmi = calculateBMI(user.height, user.weight);
            user.dailyRequiredCalories = calculateDailyRequiredCalories(user);
        }

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            profile: updatedUser,
            message: "Profile updated successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating profile.",
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Remove user from all courses
        await Promise.all(user.courses.map(courseId => 
            Course.findByIdAndUpdate(
                courseId,
                { $pull: { studentsEnrolled: userId } },
                { new: true }
            )
        ));

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Delete associated course progress records
        await CourseProgress.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        if(!req.files) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME|| "displayPictures",
            1000,
            1000
        );
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: image.secure_url },
            { new: true }
        );
        res.send({
            success: true,
            message: `Image updated successfully`,
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).exec();

        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        let userDetails = await User.findById(userId)
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec();
        
        userDetails = userDetails.toObject();
        let SubsectionLength = 0;

        for (let course of userDetails.courses) {
            let totalDurationInSeconds = 0;
            SubsectionLength = 0;

            for (let content of course.courseContent) {
                totalDurationInSeconds += content.subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
                course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);
                SubsectionLength += content.subSection.length;
            }

            let courseProgressCount = await CourseProgress.findOne({
                courseID: course._id,
                userId: userId,
            });
            courseProgressCount = courseProgressCount?.completedVideos.length;

            course.progressPercentage = SubsectionLength === 0 ? 100 : Math.round((courseProgressCount / SubsectionLength) * 100 * 100) / 100;
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id });

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            // Create a new object with the additional fields
            return {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };
        });

        res.status(200).json({ courses: courseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
