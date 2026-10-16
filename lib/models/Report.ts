import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  reason: "SPAM" | "INAPPROPRIATE" | "FAKE_LISTING" | "HARASSMENT" | "OTHER";
  details?: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    reason: {
      type: String,
      enum: ["SPAM", "INAPPROPRIATE", "FAKE_LISTING", "HARASSMENT", "OTHER"],
      required: true,
      default: "OTHER",
    },
    details: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "RESOLVED", "DISMISSED"],
      default: "PENDING",
    },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ReportSchema.index({ itemId: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ reporterId: 1 });

export const Report: Model<IReport> = models.Report || mongoose.model<IReport>("Report", ReportSchema);
