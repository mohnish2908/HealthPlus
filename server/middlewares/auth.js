const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

// Configuring dotenv to load environment variables from .env file
dotenv.config();
// Function to fetch token from user model
// const fetchTokenFromUser = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     return user.token;
//   } catch (error) {
//     console.error("Error fetching token from user model:", error);
//     throw new Error("Unable to fetch token");
//   }
// };
// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
    // console.log("1a")
    // Extract token from cookies, body, or headers
    // console.log(req.headers.cookie);
    // const token = req.headers.cookie.split("=")[1];
    
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("authorization")?.replace("Bearer ", "");

    // const token= req.user.token;
    console.log(token);
  
    
    // if (!req.user || !req.user.id) {  
    //   return res.status(401).json({ success: false, message: "User not authenticated" });  
    // }  
    // const token = await fetchTokenFromUser(req.user.id);
    
    
     // const authHeader = req.header("Authorization");
    // console.log(authHeader);
    // const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(' ')[1] : null;


    // Log the extracted token for debugging
    console.log("Extracted Token:", token);

    // If token is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    try {
      // Verify the token using the secret key from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Log the decoded token for debugging
      console.log("Decoded Token:", decoded);
      // Attach the decoded user information to the request object
      req.user = decoded;
    } catch (error) {
      // Log the error for debugging
      console.error("Token verification error:", error);
      // If token verification fails, return 401 Unauthorized response
      return res.status(401).json({ success: false, message: "Token is invalid" });
    }
    // console.log("2a")
    // If token is valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging
    console.error("Authentication error:", error);
    // If there is an error during the authentication process, return 401 Unauthorized response
    return res.status(401).json({ success: false, message: "Something went wrong while validating the token" });
  }
};

// Middleware to check if user is a Client
exports.isClient = async (req, res, next) => {
  try {
    // console.log("1b")
    const userDetails = await User.findById(req.user.id);

    if (userDetails.accountType !== "Client") {
      return res.status(403).json({ success: false, message: "This route is restricted to Clients" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User role can't be verified" });
  }
};

// Middleware to check if user is an Instructor
exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);

    if (userDetails.accountType !== "Instructor") {
      return res.status(403).json({ success: false, message: "This route is restricted to Instructors" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User role can't be verified" });
  }
};

// Middleware to check if user is an Admin
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);

    if (userDetails.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "This route is restricted to Admins" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User role can't be verified" });
  }
};

// exports.isAuthenticated = (req, res, next) => {
//   const token = req.headers['authorization'];
  
//   if (!token) {
//     return res.status(403).json({
//       success: false,
//       message: 'No token provided'
//     });
//   }
  
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({
//         success: false,
//         message: 'Failed to authenticate token'
//       });
//     }
    
//     req.user = decoded;
//     next();
//   });
// };