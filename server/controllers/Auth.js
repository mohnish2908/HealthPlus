const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

// Send OTP For Email Verification
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure unique OTP
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    // Store OTP in DB
    await OTP.create({ email, otp });

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
      const {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          accountType,
          otp,
          height,
          weight,
          age,
          gender,
          activityLevel,
      } = req.body;

      // Validate required fields
      if (
          !firstName ||
          !lastName ||
          !email ||
          !password ||
          !confirmPassword ||
          !otp ||
          //age
          !gender ||
          (accountType === 'Client' && (!height || !weight || !activityLevel))
      ) {
          return res.status(403).send({
              success: false,
              message: "All fields are required.",
          });
      }
      
      // Check if password and confirm password match
      if (password !== confirmPassword) {
          return res.status(400).json({
              success: false,
              message: "Password and Confirm Password do not match.",
          });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: "User already exists. Please sign in to continue.",
          });
      }

      // Validate OTP
      const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
      if (response.length === 0 || otp !== response[0].otp) {
          return res.status(400).json({
              success: false,
              message: "Invalid OTP.",
          });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Set default profile image
      const image = gender === "male"
          ? "https://api.dicebear.com/9.x/adventurer/svg?seed=Nala"
          : "https://api.dicebear.com/9.x/adventurer/svg?seed=Gracie";

      // Create the user with profile data directly
      const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          accountType,
          height: accountType === 'Client' ? height : null,
          weight: accountType === 'Client' ? weight : null,
          age: accountType === 'Client' ? age : null,
          gender,
          activityLevel: accountType === 'Client' ? activityLevel : null,
          image
      });

      return res.status(200).json({
          success: true,
          user,
          message: "User registered successfully.",
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "User cannot be registered. Please try again.",
      });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill up All the Required Fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not Registered with Us. Please SignUp to Continue",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      // const refreshToken = jwt.sign(
      //   { email: user.email, id: user._id },
      //   process.env.JWT_REFRESH_SECRET,
      //   { expiresIn: "30d" }
      // );
      console.log(token);

      user.token = token;
      await user.save();
      user.password = undefined;
      
      

      // user=user.toObject();
      // user.token=token;
      // user.password=undefined;

      const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true, // Cookie accessible only by the web server
      };

      res.cookie("token", token, options)
        .status(200)
        .json({
          success: true,
          user,
          message: "User Login Success",
        });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure. Please Try Again",
    });
  }
};
// Change Password controller
exports.changePassword = async (req, res) => {
  try {
      const { email, oldPassword, newPassword, confirmPassword } = req.body;

      // Validate required fields
      if (!email || !oldPassword || !newPassword || !confirmPassword) {
          return res.status(400).json({
              success: false,
              message: "All fields are required.",
          });
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
          return res.status(400).json({
              success: false,
              message: "New Password and Confirm Password do not match.",
          });
      }

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found.",
          });
      }

      // Check if the old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(400).json({
              success: false,
              message: "Old password is incorrect.",
          });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();

      return res.status(200).json({
          success: true,
          message: "Password changed successfully.",
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "An error occurred while changing the password.",
      });
  }
};

// Additional controllers (refreshToken, logout, changePassword) remain the same...

// const bcrypt = require("bcrypt")
// const User = require("../models/User")
// const OTP = require("../models/OTP")
// const jwt = require("jsonwebtoken")
// const otpGenerator = require("otp-generator")
// const mailSender = require("../utils/mailSender")
// const { passwordUpdated } = require("../mail/templates/passwordUpdate")
// const Profile = require("../models/Profile")
// require("dotenv").config()


// // Send OTP For Email Verification
// exports.sendOTP = async (req, res) => {
//     try {
//       const { email } = req.body
  
//       // Check if user is already present
//       // Find user with provided email
//       const checkUserPresent = await User.findOne({ email })
//       // to be used in case of signup
  
//       // If user found with provided email
//       if (checkUserPresent) {
//         // Return 401 Unauthorized status code with error message
//         return res.status(401).json({
//           success: false,
//           message: `User is Already Registered`,
//         })
//       }
  
//       // generate otp
//       var otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//       })
//       // to check if this otp already exist or not 
//       const result = await OTP.findOne({ otp: otp })
//       console.log("Result is Generate OTP Func")
//       console.log("OTP", otp)
//       console.log("Result", result)
//       // if this otp already exist in the db then new otp is generated until a unique otp is got
//       while (result) {
//         otp = otpGenerator.generate(6, {
//           upperCaseAlphabets: false,
//           lowerCaseAlphabets: false,
//           specialChars: false,
//         });
//         result=await OTP.findOne({otp:otp});
//       }
//       const otpPayload = { email, otp }
//       const otpBody = await OTP.create(otpPayload)
//       console.log("OTP Body", otpBody)
//       res.status(200).json({
//         success: true,
//         message: `OTP Sent Successfully`,
//         otp,
//       })
//     } catch (error) {
//       console.log(error.message)
//       return res.status(500).json({ success: false, error: error.message })
//     }
// }
  

// exports.signup = async (req, res) => {

//     //data fetch from request body
//   // validate 
//   // 2 password match
//   // check user already exist or not
//   //find most recent otp stored for the user
//   // validate otp
//   // hash password
//   // entry created in db

//   try {
//     // Destructure fields from the request body
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       confirmPassword,
//       accountType,
//       otp,
//       height,
//       weight,
//       age,
//       gender,
//       activityLevel,
//     } = req.body;

//     // Check if all required details are present
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !password ||
//       !confirmPassword ||
//       !otp ||
//       !age ||
//       !gender ||
//       (accountType === 'Client' && (!height || !weight || !activityLevel))
//     ) {
//       return res.status(403).send({
//         success: false,
//         message: "All fields are required.",
//       });
//     }
//     console.log("1");
//     // Check if password and confirm password match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Password and Confirm Password do not match.",
//       });
//     }
//     console.log("2");
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists. Please sign in to continue.",
//       });
//     }
//     const Profile = require("../models/Profile");
//     const User = require("../models/User"); // Import the User model
//     require("dotenv").config();
    
//     // Send OTP For Email Verification
//     exports.sendOTP = async (req, res) => {
//         try {
//             const { email } = req.body;
    
//             // Check if user is already present
//             // Find user with provided email
//             const checkUserPresent = await User.findOne({ email });
//             // to be used in case of signup
    
//             // If user found with provided email
//             if (checkUserPresent) {
//                 // Return 401 Unauthorized status code with error message
//                 return res.status(401).json({
//                     success: false,
//                     message: `User is Already Registered`,
//                 });
//             }
    
//             // Continue with OTP sending logic here...
    
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({
//                 success: false,
//                 message: "Server Error",
//             });
//         }
//     };
//     // Validate OTP
//     const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
//     if (response.length === 0 || otp !== response[0].otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP.",
//       });
//     }
//     const image = gender === "male" ? 
//     "https://api.dicebear.com/9.x/adventurer/svg?seed=Nala"
//     : "https://api.dicebear.com/9.x/adventurer/svg?seed=Gracie";
//     console.log("4");
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("5");
//     console.log("7");
//     // Create the user
//     const user = await User.create({
//       firstName,
//       lastName, 
//       email,
//       password: hashedPassword,
//       accountType,
//       //additionalDetails: profileDetails._id,
//       // image: `http://api.dicebear.com/5.x/initial/svg?seed=${firstName} ${lastName}` --this will set the profile picture as the first character of the first and the last name
//       image
      
//     });
//     console.log("8");
//     // Create the Additional Profile For User
//     const profileDetails = await Profile.create({
//       user: user._id, // Will link to user later
//       height: accountType === 'Client' ? height : null,
//       weight: accountType === 'Client' ? weight : null,
//       age,
//       gender,
//       activityLevel: accountType === 'Client' ? activityLevel : null,
//     });
//     console.log("6");
    

//     console.log("");
//     // Update the Profile with the correct user ID
//     //profileDetails.user = user._id;
//     console.log("9");
//     await profileDetails.save();
//     console.log("10");
//     return res.status(200).json({
//       success: true,
//       user,
//       message: "User registered successfully.",
//     });
    
//   }
//   catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "User cannot be registered. Please try again.",
//     });
//   }
// };

// // Login Controller
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("1");
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please Fill up All the Required Fields",
//       });
//     }
//     console.log("2");
//     const user = await User.findOne({ email }).populate("additionalDetails");
//     console.log("3");
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User is not Registered with Us. Please SignUp to Continue",
//       });
//     }
//     console.log("4");
//     if (await bcrypt.compare(password, user.password)) {
//       const accessToken = jwt.sign(
//         { email: user.email, id: user._id, accountType: user.accountType },
//         process.env.JWT_SECRET,
//         { expiresIn: "24h" }
//       );
//       console.log("5");
//       const refreshToken = jwt.sign(
//         { email: user.email, id: user._id },
//         process.env.JWT_REFRESH_SECRET,
//         { expiresIn: "30d" }
//       );
//       console.log("6");
//       user.token = accessToken;
//       user.refreshToken = refreshToken;
//       user.password = undefined;
//       console.log("7");
//       const options = {
//         expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//       };
//       console.log("8");
//       res.cookie("accessToken", accessToken, { ...options, maxAge: 24 * 60 * 60 * 1000 })
//         .cookie("refreshToken", refreshToken, options)
//         .status(200)
//         .json({
//           success: true,
//           token: accessToken,
//           refreshToken,
//           user,
//           message: "User Login Success",
//         });
//     }
//     else {
//       return res.status(401).json({
//         success: false,
//         message: "Password is incorrect",
//       });
//     }
//     console.log("9");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Login Failure. Please Try Again",
//     });
//   }
// };

// // Refresh Token Controller
// exports.refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Refresh token is required",
//       });
//     }

//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.status(403).json({
//           success: false,
//           message: "Invalid or expired refresh token",
//         });
//       }

//       const user = await User.findById(decoded.id);
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       const newAccessToken = jwt.sign(
//         { email: user.email, id: user._id, accountType: user.accountType },
//         process.env.JWT_SECRET,
//         { expiresIn: "24h" }
//       );

//       res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
//         .status(200)
//         .json({
//           success: true,
//           accessToken: newAccessToken,
//           message: "Access token refreshed successfully",
//         });
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error refreshing token",
//     });
//   }
// };

// // Logout Controller
// exports.logout = async (req, res) => {
//   try {
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");

//     return res.status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error logging out",
//     });
//   }
// };


// exports.changePassword = async (req, res) => {
//   try {
//     // Get user data from req.user
//     const userDetails = await User.findById(req.user.id);

//     // Get old password, new password, and confirm new password from req.body
//     const { oldPassword, newPassword, confirmNewPassword } = req.body;

//     // Validate that the new password and confirm new password match
//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
//     }

//     // Validate old password
//     const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
//     if (!isPasswordMatch) {
//       return res.status(401).json({ success: false, message: "The old password is incorrect" });
//     }

//     // Hash new password
//     const encryptedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password in the database
//     const updatedUserDetails = await User.findByIdAndUpdate(
//       req.user.id,
//       { password: encryptedPassword },
//       { new: true }
//     );

//     // Send notification email
//     try {
//       const emailResponse = await mailSender(
//         updatedUserDetails.email,
//         "Password for your account has been updated",
//         passwordUpdated(
//           updatedUserDetails.email,
//           `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
//         )
//       );
//       console.log("Email sent successfully:", emailResponse.response);
//     } catch (emailError) {
//       console.error("Error occurred while sending email:", emailError);
//       return res.status(500).json({
//         success: false,
//         message: "Error occurred while sending email",
//         error: emailError.message,
//       });
//     }

//     // Return success response
//     return res.status(200).json({ success: true, message: "Password updated successfully" });
//   } catch (error) {
//     // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
//     console.error("Error occurred while updating password:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error occurred while updating password",
//       error: error.message,
//     });
//   }
// };

