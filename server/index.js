  // Importing necessary modules and packages
  const express = require("express");
  const mongoose = require("mongoose");
  const bodyParser = require('body-parser');
  const dotenv = require("dotenv");
  const cookieParser = require("cookie-parser");
  const cors = require("cors");
  const path = require('path');
  const fileUpload = require("express-fileupload");
  const { cloudinaryConnect } = require("./config/cloudinary");
  const app = require("./app");
  const database = require("./config/database");

  // const app = express();
  database.connect();
  // Load environment variables
  dotenv.config();

  // Setting up port number
  const PORT = process.env.PORT || 4000;

  // Middleware
  app.use(express.json()); // For parsing JSON bodies
  app.use(express.json()); // For parsing JSON bodies
  app.use(cookieParser()); // For parsing cookies
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Import routes
  const authRoutes = require('./routes/User');
  const profileRoutes = require('./routes/Profile');
  const courseRoutes = require('./routes/Course');
  const dailyIntakeRoutes = require('./routes/DailyIntakeRoutes');
  // const nutritionRoutes = require('./routes/Nutrition');
  const contactUsRoute = require('./routes/Contact');
  const paymentRoutes = require("./routes/Payments");


  //configuring the routes file here
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/profile', profileRoutes);
  app.use('/api/v1/course', courseRoutes);
  app.use('/api/v1/daily-intake', dailyIntakeRoutes);
  // app.use('/api/v1/nutrition', nutritionRoutes);
  app.use('/api/v1/reach', contactUsRoute);
  app.use("/api/v1/payment", paymentRoutes);


  // Connecting to the MongoDB database
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

  // Middleware setup
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: "*", credentials: true }));
  app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

  // Connect to Cloudinary
  cloudinaryConnect();

  // Start the server

  app.listen(PORT, () => {
    console.log("Server is up at the port ", PORT);
  });

  // // Importing necessary modules and packages
  // const express = require("express");
  // const app = express();
  // const userRoutes = require("./routes/User");
  // const profileRoutes = require("./routes/Profile");
  // const courseRoutes = require("./routes/Course");
  // const paymentRoutes = require("./routes/Payments");
  // const contactUsRoute = require("./routes/Contact");
  // const database = require("./config/database");
  // const cookieParser = require("cookie-parser");
  // const cors = require("cors");
  // const { cloudinaryConnect } = require("./config/cloudinary");
  // const fileUpload = require("express-fileupload");
  // const dotenv = require("dotenv");

  // // Loading environment variables from .env file
  // dotenv.config();

  // // Setting up port number
  // const PORT = process.env.PORT || 3000;

  // // Connecting to database
  // database.connect();

  // // Middlewares
  // app.use(express.json());
  // app.use(cookieParser());
  // app.use(
  // 	cors({
  // 		origin: "*",
  // 		credentials: true,
  // 	})
  // );
  // app.use(
  // 	fileUpload({
  // 		useTempFiles: true,
  // 		tempFileDir: "/tmp/",
  // 	})
  // );

  // // Connecting to cloudinary
  // cloudinaryConnect();

  // // Setting up routes
  // app.use("/api/v1/auth", userRoutes);
  // app.use("/api/v1/profile", profileRoutes);
  // app.use("/api/v1/course", courseRoutes);
  // app.use("/api/v1/payment", paymentRoutes);
  // app.use("/api/v1/reach", contactUsRoute);

  // // Testing the server
  // app.get("/", (req, res) => {
  // 	return res.json({
  // 		success: true,
  // 		message: "Your server is up and running ...",
  // 	});
  // });

  // // Listening to the server
  // app.listen(PORT, () => {
  // 	console.log(`App is listening at ${PORT}`);
  // });

  // // End of code.
