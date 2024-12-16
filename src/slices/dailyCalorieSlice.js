import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meals: {
    breakfast: JSON.parse(localStorage.getItem("breakfast")) || [],
    lunch: JSON.parse(localStorage.getItem("lunch")) || [],
    dinner: JSON.parse(localStorage.getItem("dinner")) || [],
    snacks: JSON.parse(localStorage.getItem("snacks")) || [],
  },
  totalCalories: 0, // Dynamically calculated
};

// Utility to calculate total calories
const calculateTotalCalories = (meals) => {
  return Object.values(meals)
    .flat()
    .reduce((sum, meal) => sum + (meal.calories || 0), 0);
};

const dailyCalorieSlice = createSlice({
  name: "dailyCalorie",
  initialState,
  reducers: {
    setMeals: (state, action) => {
      const { breakfast, lunch, dinner, snacks } = action.payload;

      if (breakfast) state.meals.breakfast = breakfast;
      if (lunch) state.meals.lunch = lunch;
      if (dinner) state.meals.dinner = dinner;
      if (snacks) state.meals.snacks = snacks;

      localStorage.setItem("breakfast", JSON.stringify(state.meals.breakfast));
      localStorage.setItem("lunch", JSON.stringify(state.meals.lunch));
      localStorage.setItem("dinner", JSON.stringify(state.meals.dinner));
      localStorage.setItem("snacks", JSON.stringify(state.meals.snacks));

      state.totalCalories = calculateTotalCalories(state.meals);
    },
    setTotalCalories: (state, action) => {
      state.totalCalories = action.payload;
    },
    resetMeals: (state) => {
      Object.keys(state.meals).forEach((mealTime) => {
        localStorage.removeItem(mealTime);
      });
      state.meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      };
      state.totalCalories = 0;
    },
  },
});

export const { setMeals, setTotalCalories, resetMeals } = dailyCalorieSlice.actions;
export default dailyCalorieSlice.reducer;
