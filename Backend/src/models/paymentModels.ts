import mongoose, { Schema, Document } from "mongoose"; 
export interface IPayments extends Document {
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  productName: string;
metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

const paymentSchema = new mongoose.Schema<IPayments>(
  {
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      sparse: true,
      index: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ status: 1, createdAt: -1 });
export const Payment = mongoose.model<IPayments>("Payments", paymentSchema);
