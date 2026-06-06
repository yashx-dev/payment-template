import express from "express";

import {
  createCheckoutSession,
  getPaymentStatus,
  handleWebhook,
} from "../controllers/paymentsController"

import {
  validateCheckoutSession,
  handleValidationErrors,
} from "../middleware/validationMiddleware";

const router = express.Router();

router.post(
  "/create-checkout-session",
  validateCheckoutSession,
  handleValidationErrors,
  createCheckoutSession,
);

router.get("/payment-status/:sessionId", getPaymentStatus);

router.post("/webhook", handleWebhook);

export default router;
