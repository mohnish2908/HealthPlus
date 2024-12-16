import React from "react";
import { useSelector, useDispatch } from 'react-redux'

const Graph = () => {
// const {meals,totalCalories}=useSelector(state=>state.dailyCalorie)
// console.log("meals:",meals)
// console.log("totalCalories:",totalCalories)
  return (
    <div className="bg-ri
    chblue-100 text-white rounded-lg h-40 flex flex-col items-center justify-center">
      <p className="text-lg">Graph</p>
      <p className="text-sm">It will show the calorie consumed per day basis</p>
    </div>
  );
};

export default Graph;
