import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IClaim extends Document {
  itemId: mongoose.Types.ObjectId;
  claimantId: mongoose.Types.ObjectId;
  finderId: mongoose.Types.ObjectId;
  status: "PENDING" | "CHAT_VERIFICATION" | "PROOF_SUBMITTED" | "APPROVED" | "REJECTED" | "HANDOVER_PENDING" | "COMPLETED" | "CANCELLED";
  proofDescription?: string;
  proofFiles: { url: string; publicId: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema = new Schema<IClaim>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    claimantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    finderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CHAT_VERIFICATION",
        "PROOF_SUBMITTED",
        "APPROVED",
        "REJECTED",
        "HANDOVER_PENDING",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    proofDescription: { type: String },
    proofFiles: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

ClaimSchema.index({ itemId: 1 });
ClaimSchema.index({ claimantId: 1 });
ClaimSchema.index({ finderId: 1 });

export const Claim: Model<IClaim> = models.Claim || mongoose.model<IClaim>("Claim", ClaimSchema);
