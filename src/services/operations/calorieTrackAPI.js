import toast from "react-hot-toast";
import { calorieTrackingEndpoints } from "../apis";
import {apiConnector} from "../apiconnector";

const {
    GET_CALORIE_DATA_API,
    DELETE_MEAL_API,
    EDIT_MEAL_API,
    GET_TODAY_CALORIE_DATA_API
}=calorieTrackingEndpoints;

export const getCalorieData = async (foodItem, mealTime, token) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(
            "POST",
            GET_CALORIE_DATA_API,
            { foodItem, mealTime },
            { Authorization: `Bearer ${token}` } // Correct headers format
        );
        // Extract and log the response data
        console.log("Calorie Data Response:", response.data);
        toast.success("Calorie data fetched successfully!");
        return response.data; // Return the response data for further use
    } catch (error) {
        console.error("Error fetching calorie data:", error);
        toast.error("Failed to fetch calorie data");
        throw error; // Rethrow the error for the caller to handle
    } finally {
        toast.dismiss(toastId);
    }
};


export const deleteMeal = async (intakeId) => {
    const toastId = toast.loading("Deleting meal...");
    try {
        const response = await apiConnector("DELETE", DELETE_MEAL_API, {intakeId}, null, null);
        return response;
    } catch (error) {
        toast.error("Failed to delete meal");
        return error;
    }
    finally {
        toast.dismiss(toastId);
    }
}

export const getTodayCalorieData = async (userId,mealTime) => {
    try {
        const response = await apiConnector("POST", GET_TODAY_CALORIE_DATA_API, {userId,mealTime}, null,null);
        return response.data;
    } catch (error) {
        toast.error("Failed to fetch today's calorie data");
        return error;
    }
}