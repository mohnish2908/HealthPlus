import React, { useState } from "react";
import { Table, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { getCalorieData } from "../../../../services/operations/calorieTrackAPI";
import { useSelector, useDispatch } from "react-redux";
import {
  setMeals,
  setTotalCalories,
} from "../../../../slices/dailyCalorieSlice";
import { MdDelete } from "react-icons/md";
import { deleteMeal } from "../../../../services/operations/calorieTrackAPI";
import toast from "react-hot-toast";

const MealSection = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [foodInput, setFoodInput] = useState("");
  const { token } = useSelector((state) => state.auth);
  const { meals } = useSelector((state) => state.dailyCalorie);
  const dispatch = useDispatch();

  const mealData = meals[title.toLowerCase()] || [];
  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleAddFood = async () => {
    if (foodInput.trim()) {
      try {
        const response = await getCalorieData(foodInput, title, token);
        let foodData = response.data;

        if (!Array.isArray(foodData)) {
          foodData = [foodData];
        }

        const updatedMeals = {
          ...meals,
          [title.toLowerCase()]: [...mealData, ...foodData],
        };

        dispatch(setMeals(updatedMeals));

        const newTotalCalories = Object.values(updatedMeals)
          .flat()
          .reduce((total, food) => total + (food.calories || 0), 0);
        dispatch(setTotalCalories(newTotalCalories));

        setFoodInput("");
      } catch (error) {
        console.error("Error fetching calorie data:", error);
      }
    }
  };

  const handleDeleteFood = async (intakeId) => {
    try {
      const response = await deleteMeal(intakeId);
      toast.success("Meal deleted successfully!");

      const updatedMeals = {
        ...meals,
        [title.toLowerCase()]: mealData.filter((food) => food._id !== intakeId),
      };

      dispatch(setMeals(updatedMeals));

      const newTotalCalories = Object.values(updatedMeals)
        .flat()
        .reduce((total, food) => total + (food.calories || 0), 0);
      dispatch(setTotalCalories(newTotalCalories));
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error("Failed to delete meal");
    }
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <button
        className="flex justify-between items-center w-full bg-blue-600 text-white py-3 px-5 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={toggleOpen}
      >
        <span className="font-semibold">{title}</span>
        <span className="text-lg">{isOpen ? "-" : "+"}</span>
      </button>

      {/* Section Content */}
      {isOpen && (
        <div className="bg-blue-50 p-5 mt-4 rounded-lg shadow-lg">
          {/* Input for Food */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              placeholder={`Enter food item for ${title}`}
              className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
            />
            <button
              onClick={handleAddFood}
              className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600 transition"
            >
              Add
            </button>
          </div>

          {/* Food List */}
          <div className="overflow-x-auto border rounded-lg">
            <Table className="table-auto w-full border-collapse">
              <thead className="bg-gray-800 text-richblack">
                <Tr>
                  <Th className="border border-gray-300 px-4 py-2 text-left">
                    Food Item
                  </Th>
                  <Th className="border border-gray-300 px-4 py-2 text-left">
                    Calories (kcal)
                  </Th>
                  <Th className="border border-gray-300 px-4 py-2 text-left">
                    Protein (g)
                  </Th>
                  <Th className="border border-gray-300 px-4 py-2 text-left">
                    Fat (g)
                  </Th>
                  <Th className="border border-gray-300 px-4 py-2 text-center">
                    Delete
                  </Th>
                </Tr>
              </thead>
              <Tbody>
                {mealData.length > 0 ? (
                  mealData.map((food, index) => (
                    <Tr
                      key={index}
                      className="even:bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <Td className="border border-gray-300 px-4 py-2">
                        {food.food}
                      </Td>
                      <Td className="border border-gray-300 px-4 py-2">
                        {food.calories}
                      </Td>
                      <Td className="border border-gray-300 px-4 py-2">
                        {food.protein}
                      </Td>
                      <Td className="border border-gray-300 px-4 py-2">
                        {food.fat}
                      </Td>
                      <Td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          className="bg-red-500 text-yellow p-2 rounded-full hover:bg-red-600 transition"
                          onClick={() => handleDeleteFood(food._id)}
                        >
                          <MdDelete size={18} />
                        </button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td
                      colSpan="5"
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      No food items added yet.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSection;
