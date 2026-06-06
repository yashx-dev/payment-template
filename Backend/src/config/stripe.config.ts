import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  maxNetworkRetries: 2,
  timeout: 80000,
});

export const PRODUCT_CONFIG = {
  name: "Premium Product",
  priceId: "price_xxxxxxxxxxxxx", // Reference to Stripe Price object
  amount: 2999, // For reference only, not used in API calls
  currency: "usd",
  description: "High-quality premium product with lifetime access",
};
