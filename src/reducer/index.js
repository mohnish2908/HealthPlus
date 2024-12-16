// src/reducers/rootReducer.js

import { combineReducers } from '@reduxjs/toolkit';
import dailyCalorieReducer from '../slices/dailyCalorieSlice';
import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import cartReducer from '../slices/cartSlice';
import courseReducer from '../slices/courseSlice';

const rootReducer = combineReducers({
  dailyCalorie: dailyCalorieReducer, // Add dailyCalorie reducer here
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  course: courseReducer,
});

export default rootReducer;
