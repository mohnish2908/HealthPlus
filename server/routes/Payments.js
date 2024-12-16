// Import the required modules
const express = require("express")
const router = express.Router()

const {
  capturePayment,
  // verifySignature,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payments")

const { auth, isInstructor, isClient, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isClient, capturePayment)
router.post("/verifyPayment", auth, isClient, verifyPayment)
router.post("/sendPaymentSuccessEmail",auth,isClient,sendPaymentSuccessEmail)
// router.post("/verifySignature", verifySignature)

module.exports = router
