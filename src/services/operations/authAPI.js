import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setMeals, setTotalCalories,resetMeals } from "../../slices/dailyCalorieSlice";
import { getTodayCalorieData } from "./calorieTrackAPI";
import { useSelector } from "react-redux";
const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      console.log("SENDOTP API RESPONSE............", response);

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  height,
  weight,
  age,
  gender,
  activityLevel,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      console.log(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        height,
        weight,
        age,
        gender,
        activityLevel
      );
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        height,
        weight,
        age,
        gender,
        activityLevel,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    console.log("email and passoword:", email, password);

    try {
      // console.log("1")
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });
      console.log("2")
      console.log("LOGIN API RESPONSE.......", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.user.token)); //token
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));

      // Fetch today's calorie data for the user
      const calDataBreakfast = await getTodayCalorieData(response.data.user._id, "breakfast"); 
      const calDataLunch = await getTodayCalorieData(response.data.user._id, "lunch");
      const calDataDinner = await getTodayCalorieData(response.data.user._id, "dinner");
      const calDataSnacks = await getTodayCalorieData(response.data.user._id, "snacks");
      localStorage.setItem("breakfast", JSON.stringify(calDataBreakfast.data));
      localStorage.setItem("lunch", JSON.stringify(calDataLunch.data));
      localStorage.setItem("dinner", JSON.stringify(calDataDinner.data));
      localStorage.setItem("snacks", JSON.stringify(calDataSnacks.data));
      // console.log("TODAY CALORIE DATA............cal data:", calDataBreakfast.data);
      // console.log("TODAY CALORIE DATA............cal data:", calData);
      // dispatch(setMeals(calData.data)); // Pass the whole array of food items here
      dispatch(setMeals({breakfast:calDataBreakfast.data,lunch:calDataLunch.data,dinner:calDataDinner.data,snacks:calDataSnacks.data})); // Pass the whole array of food items here
      // Optionally update the total calories if needed
      
      // const totalCalories =await calData.reduce((total, item) => total + item.calories, 0);
      // dispatch(setTotalCalories(totalCalories));

      // const totalCalories = Object.values({breakfast:calDataBreakfast.data,lunch:calDataLunch.data,dinner:calDataDinner.data,snacks:calDataSnacks.data}).flat().reduce( (total, food) => total + (food.calories || 0), 0);
      // console.log("TODAY CALORIE DATA............cal data:", totalCalories);
      // localStorage.setItem("totalCalories", JSON.stringify(totalCalories));
      // dispatch(setTotalCalories(totalCalories));
      localStorage.setItem("token", JSON.stringify(response.data.user.token)); //token
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESETPASSTOKEN RESPONSE............", response);

      if (!response.data.sucess) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error);
      // console.log(error.message)
      toast.error(error.message);
    }

    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESETPASSWORD RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      navigate("/login");
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error);
      toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());

    // Reset all meal data
    dispatch(resetMeals());  

    
    // Remove items from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("breakfast");
    localStorage.removeItem("lunch");
    localStorage.removeItem("dinner");
    localStorage.removeItem("snacks");
    // localStorage.removeItem("totalCalories");
    
    // Show success toast
    toast.success("Logged Out");
    
    // Redirect to home page
    navigate("/");
  };
}

