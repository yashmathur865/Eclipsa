const express = require("express");
const router = express.Router();

const { auth, isCustomer } = require("../middlewares/auth");
const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail
} = require("../controllers/Payments");

router.post("/capture", auth, isCustomer, capturePayment);
router.post("/verify", auth, isCustomer, verifyPayment);
router.post("/email/success", auth, isCustomer, sendPaymentSuccessEmail);

module.exports = router;
