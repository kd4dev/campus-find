import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IHandover extends Document {
  claimId: mongoose.Types.ObjectId;
  finderId: mongoose.Types.ObjectId;
  claimantId: mongoose.Types.ObjectId;
  otpHash: string;
  expiresAt: Date;
  verifiedAt?: Date;
  attemptCount: number;
  status: "CREATED" | "VERIFIED" | "EXPIRED" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

const HandoverSchema = new Schema<IHandover>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: "Claim", required: true },
    finderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    claimantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date },
    attemptCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["CREATED", "VERIFIED", "EXPIRED", "FAILED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

export const Handover: Model<IHandover> = models.Handover || mongoose.model<IHandover>("Handover", HandoverSchema);
