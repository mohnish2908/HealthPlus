

// Function to calculate BMI
const calculateBMI = (height, weight) => {
    if (height && weight) {
      return weight / ((height / 100) ** 2);
    }
    return 0;
  };
  
  // Function to calculate daily required calories
  const calculateDailyRequiredCalories = (profile) => {
    let bmr;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    return bmr * (activityFactors[profile.activityLevel] || 1.2);
  };
  
module.exports = {
    calculateBMI,
    calculateDailyRequiredCalories,
};
  