const request = require('request');
const DailyIntake = require('../models/DailyIntake');
const User = require('../models/User');

const addDailyIntakeToUser = async (userId, dailyIntakeId) => {
  await User.findByIdAndUpdate(userId, {
    $push: { dailyIntake: dailyIntakeId }
  });
};

//can also create one array of monthly intake and push the daily intake id to it and then update the user with the monthly intake array also deleteing the daily intake id from the array when deleting the daily intake

// Function to fetch nutritional information and save to database
exports.fetchNutritionalInfo = async (req, res) => {
  try {
    const { foodItem, mealTime } = req.body; // Added mealTime
    console.log(foodItem, mealTime);
    // API request to fetch nutritional information
    request.get({
      url: 'https://api.calorieninjas.com/v1/nutrition?query='+encodeURIComponent(foodItem),
      headers: {
        'X-Api-Key': 'hJvUqFwxFEmfxUQPEZyfiA==hhGShUA9qxtRAWHc'
      }
    },
     async (error, response, body) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Request failed',
          error: error.message
        });
      }
      
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({
          success: false,
          message: 'Error fetching nutritional information',
          error: body
        });
      }

      const data = JSON.parse(body);
      if (data.items && data.items.length > 0) {
        const nutritionData = data.items[0];

        // Save the nutritional data to the database 
        const dailyIntake = new DailyIntake({
          user: req.user.id,
          food:nutritionData.name,
          date: new Date().setHours(0, 0, 0, 0),
          mealTime, // Save the meal time 
          calories: nutritionData.calories,
          protein: nutritionData.protein_g,
          fat: nutritionData.fat_total_g || 0, // Provide a default value if fat is not available
          servingSize: nutritionData.serving_size_g,  // If available
          cholesterol: nutritionData.cholesterol_mg,  // If available
          sugar: nutritionData.sugar_g,  // If available
          fiber: nutritionData.fiber_g  // If available
        });

        await dailyIntake.save();

        // Calculate the total calories for today
        const today = new Date().toISOString().split('T')[0];
        const dailyIntakes = await DailyIntake.find({ user: req.user.id, date: today });
        const totalCalories = dailyIntakes.reduce((sum, intake) => sum + intake.calories, 0);
        
        await addDailyIntakeToUser(req.user.id, dailyIntake._id);
        
        //await User.findByIdAndUpdate(req.user.id, { totalCalories }, { new: true });
        return res.status(200).json({
          success: true,
          data: dailyIntake,
          totalCalories,
          message: 'Nutritional information fetched and saved successfully'
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No nutritional information found for the provided food item'
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Function to edit an existing daily intake entry
exports.editDailyIntake = async (req, res) => {
  try {
    const { intakeId, calories, protein, fat, servingSize, cholesterol, sugar, fiber } = req.body;
    
    // Update the daily intake entry
    const updatedIntake = await DailyIntake.findByIdAndUpdate(intakeId, {
      calories,
      protein,
      fat,
      servingSize,
      cholesterol,
      sugar,
      fiber
    }, { new: true });

    // Calculate the total calories for today
    const today = new Date().toISOString().split('T')[0];
    const dailyIntakes = await DailyIntake.find({ user: req.user.id, date: today });
    const totalCalories = dailyIntakes.reduce((sum, intake) => sum + intake.calories, 0);

    return res.status(200).json({
      success: true,
      updatedIntake,
      totalCalories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Function to update daily intake (e.g., for resetting data)
exports.updateDailyIntake = async (req, res) => {
  try {
    const { intakeId, updates } = req.body;

    // Update the daily intake entry
    const updatedIntake = await DailyIntake.findByIdAndUpdate(intakeId, updates, { new: true });

    // Calculate the total calories for today
    const today = new Date().toISOString().split('T')[0];
    const dailyIntakes = await DailyIntake.find({ user: req.user.id, date: today });
    const totalCalories = dailyIntakes.reduce((sum, intake) => sum + intake.calories, 0);

    return res.status(200).json({
      success: true,
      updatedIntake,
      totalCalories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Function to delete a daily intake entry
exports.deleteDailyIntake = async (req, res) => {
  try {
    const { intakeId } = req.body;
    
    // Find and delete the daily intake entry
    await DailyIntake.findByIdAndDelete(intakeId);

    // Calculate the total calories for today
    // const today = new Date().toISOString().split('T')[0];
    // const dailyIntakes = await DailyIntake.find({ user: req.user.id, date: today });
    // const totalCalories = dailyIntakes.reduce((sum, intake) => sum + intake.calories, 0);

    return res.status(200).json({
      success: true,
      message: 'Daily intake deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Function to reset daily intake data at midnight
exports.resetDailyIntake = async () => {
  try {
    const today = new Date();
    const endOfYesterday = new Date(today.setHours(0, 0, 0, 0) - 1);

    // Find all daily intake entries from the previous day
    const previousDayIntakes = await DailyIntake.find({ date: { $gte: endOfYesterday } });

    // Save previous day data to a separate collection or backup
    // (implement backup logic as needed)

    // Delete previous day data
    await DailyIntake.deleteMany({ date: { $gte: endOfYesterday } });

    // Reset daily intake data for the new day
    // (implement daily reset logic as needed)

  } catch (error) {
    console.error('Error resetting daily intake data:', error.message);
  }
};

// Function to fetch daily intake data for the graph
exports.getDailyIntakeForGraph = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - 30)); // Fetch data for the last 30 days

    const dailyIntakes = await DailyIntake.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 }); // Sort by date

    // Aggregate data by date
    const graphData = dailyIntakes.reduce((acc, intake) => {
      const dateKey = intake.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      if (!acc[dateKey]) {
        acc[dateKey] = { calories: 0, protein: 0, fat: 0 };
      }
      acc[dateKey].calories += intake.calories;
      acc[dateKey].protein += intake.protein;
      acc[dateKey].fat += intake.fat;
      return acc;
    }, {});

    // Convert object to array for chart library
    const formattedData = Object.keys(graphData).map(date => ({
      date,
      ...graphData[date]
    }));

    return res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// Controller to fetch all calorie data for today
exports.getTodayCalorieData = async (req, res) => {
  try {
    const {userId,mealTime} = req.body; // Assuming user ID is available in the request object after authentication
    // console.log("1")
    // Get the start and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    // console.log("2")
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Query the database for all entries for today
    const todayData = await DailyIntake.find({
      user: userId,
      date: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
      mealTime:mealTime,
    });
    // console.log("3")
    // If no data is found, return an appropriate message
    // if (!todayData.length) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'No calorie data found for today.',
    //   });
    // }
    // console.log("4")
    // Return the data
    return res.status(200).json({
      success: true,
      data: todayData,
    });
  } catch (error) {
    console.error('Error fetching today\'s calorie data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};



