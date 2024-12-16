const mongoose = require('mongoose');
const { calculateBMI, calculateDailyRequiredCalories } = require('../utils/calculations');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensure unique email addresses
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Client", "Instructor"],
      required: true,
    },
    resetPasswordExpires: {
      type: Date,
    },
    token: {
      type: String,
      default: "",
    },
    // Profile-related fields merged from Profile schema
    height: {
      type: Number,
      required: function () {
        return this.accountType === 'Client';
      },
    },
    weight: {
      type: Number,
      required: function () {
        return this.accountType === 'Client';
      },
    },
    age: {
      type: Number,
      required: function () {
        return this.accountType === 'Client';
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very active'],
      default: 'sedentary',
      required: function () {
        return this.accountType === 'Client';
      },
    },
    bmi: {
      type: Number,
      default: function () {
        return this.accountType === 'Client' ? calculateBMI(this.height, this.weight) : null;
      },
    },
    dailyRequiredCalories: {
      type: Number,
      default: function () {
        return this.accountType === 'Client' ? calculateDailyRequiredCalories(this) : null;
      },
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    image: {
      type: String,
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
    dailyIntake: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyIntake",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
