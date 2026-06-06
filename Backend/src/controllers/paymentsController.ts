import { Request, Response, NextFunction } from "express";
import { stripe } from "../config/stripe.config";

import {
  createCheckoutSession as createCheckoutSessionService,
  handleWebhookEvent,
  getPaymentStatus as getPaymentStatusService,
} from "../services/paymentService";

interface PaymentParams {
  sessionId: string;
}

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const successUrl = `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = `${frontendUrl}/cancel`;

    const { sessionId, url } = await createCheckoutSessionService(
      email,
      successUrl,
      cancelUrl,
      name,
    );

    return res.status(200).json({
      sessionId,
      url,
      message: "Checkout session created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).send("Missing stripe-signature header");
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    await handleWebhookEvent(event);

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatus = async (
  req: Request<PaymentParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.params;

    const status = await getPaymentStatusService(sessionId);

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};
