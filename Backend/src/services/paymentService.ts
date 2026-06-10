import Stripe from "stripe";
import { stripe, PRODUCT_CONFIG } from "../config/stripe.config.js";
import { Payment } from "../models/paymentModels.js";

export const createCheckoutSession = async (
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  customerName?: string,
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: PRODUCT_CONFIG.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        customerName: customerName || "",
        customerEmail,
      },
    });

    await Payment.create({
      stripeSessionId: session.id,
      customerEmail,
      customerName,
      amount: PRODUCT_CONFIG.amount,
      currency: PRODUCT_CONFIG.currency,
      status: "pending",
      productName: PRODUCT_CONFIG.name,
      metadata: {
        checkoutSessionUrl: session.url,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error("Create checkout session error:", error);
    throw error;
  }
};

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const payment = await Payment.findOne({
    stripeSessionId: session.id,
  });

  if (!payment) {
    return;
  }

  payment.status = "completed";

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  payment.stripePaymentIntentId = paymentIntentId;

  payment.completedAt = new Date();

  if (session.customer_details?.name) {
    payment.customerName = session.customer_details.name;
  }

  await payment.save();
};

export const handleCheckoutSessionExpired = async (
  session: Stripe.Checkout.Session,
) => {
  const payment = await Payment.findOne({
    stripeSessionId: session.id,
  });

  if (!payment) {
    return;
  }

  if (payment.status === "pending") {
    payment.status = "failed";
    await payment.save();
  }
};

export const handleChargeRefunded = async (charge: Stripe.Charge) => {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) {
    return;
  }

  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntentId,
  });

  if (!payment) {
    return;
  }

  payment.status = "refunded";

  await payment.save();
};

export const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    case "checkout.session.expired":
      await handleCheckoutSessionExpired(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    case "charge.refunded":
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }
};

export const getPaymentStatus = async (sessionId: string) => {
  const payment = await Payment.findOne({
    stripeSessionId: sessionId,
  });

  if (!payment) {
    throw new Error("Payment record not found");
  }

  return {
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    completedAt: payment.completedAt,
  };
};
