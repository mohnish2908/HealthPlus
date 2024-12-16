const express = require('express');
const router = express.Router();
const {
  fetchNutritionalInfo,
  // addDailyIntake,
  updateDailyIntake,
  deleteDailyIntake,
  // getDailyIntake,
  // getHistoricalData,
  editDailyIntake,
  getTodayCalorieData,
} = require('../controllers/DailyIntake');
const { auth } = require('../middlewares/auth'); // Use auth middleware

// Route to fetch nutritional information
router.post('/fetch-nutrition', auth, fetchNutritionalInfo);

// Route to edit a daily intake entry
router.put('/edit-intake', auth, editDailyIntake);

// Route to update an existing daily intake entry
router.put('/update-intake/:id', auth, updateDailyIntake);

// Route to delete a daily intake entry
router.delete('/delete-intake', deleteDailyIntake);

router.post('/get-today-calorie-data', getTodayCalorieData);
// Route to get daily intake data for the current day
// router.get('/get-daily-intake', auth, getDailyIntake);

// Route to get historical daily intake data
// router.get('/get-historical-data', auth, getHistoricalData);

module.exports = router;
