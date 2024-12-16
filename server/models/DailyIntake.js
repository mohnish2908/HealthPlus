const mongoose = require('mongoose');

const dailyIntakeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  food:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  mealTime: {  // Added mealTime field
    type: String,
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
    required: true
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  servingSize: {
    type: Number,
    required: false, // Optional based on API response
  },
  cholesterol: {
    type: Number,
    required: false, // Optional based on API response
  },
  sugar: {
    type: Number,
    required: false, // Optional based on API response
  },
  fiber: {
    type: Number,
    required: false, // Optional based on API response
  },
}, { timestamps: true });

module.exports = mongoose.model('DailyIntake', dailyIntakeSchema);
