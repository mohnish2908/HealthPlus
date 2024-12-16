import React from 'react'
import Graph from './Graph'
import MealSection from './MealSection'
import getCalorieData from '../../../../services/operations/calorieTrackAPI'
import { useSelector, useDispatch } from 'react-redux'
const TrackCalorie = () => {
  const { meals, totalCalories } = useSelector((state) => state.dailyCalorie);
  return (
    <div className="max-h-screen bg-gray-100 p-6">
      <div className="w-[75%] mx-auto bg shadow-lg rounded-lg p-4">
        {/* Graph */}
        {/* <div className="mb-6">
          <Graph />
        </div> */}

        {/* Meal Sections */}
        <MealSection title="breakfast" />
        <MealSection title="lunch" />
        <MealSection title="snacks" />
        <MealSection title="dinner" />

        {/* Total Calories */}
        <div className="bg-red-500 text-white text-center py-2 mt-4 rounded">
          TOTAL : {totalCalories.toFixed(2)} Calories
        </div>
      </div>
    </div>
  );
};
  

export default TrackCalorie
