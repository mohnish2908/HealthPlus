const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
// const contactUsRoute = require("./routes/Contact");
const fileUpload = require('express-fileupload');

// Load environment variables
dotenv.config();

// Create an instance of the Express app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cookieParser()); // For parsing cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

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

// Set up routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/daily-intake', dailyIntakeRoutes);
// app.use('/api/v1/nutrition', nutritionRoutes);
app.use('/api/v1/reach', contactUsRoute);
app.use("/api/v1/payment", paymentRoutes);

// Test route
app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

module.exports = app;

// // app.js
//const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// // Create an instance of the Express app
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Database connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Import routes
// const authRoutes = require('./routes/auth');
// const courseRoutes = require('./routes/course');
// const dailyIntakeRoutes = require('./routes/dailyIntake');
// const nutritionRoutes = require('./routes/nutrition');
// app.use('/api/auth', require('./routes/auth'));

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/daily-intake', dailyIntakeRoutes);
// app.use('/api/nutrition', nutritionRoutes);

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
