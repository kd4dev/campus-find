import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IItemImage {
  url: string;
  publicId: string;
}

export interface IItem extends Document {
  type: "LOST" | "FOUND";
  itemName: string;
  category: string;
  description: string;
  location: string;
  date: Date;
  approximateTime?: string;
  color?: string;
  brand?: string;
  itemModel?: string;
  distinguishingFeatures?: string; // Kept somewhat private for FOUND items
  serialNumber?: string;
  images: IItemImage[];
  status: "ACTIVE" | "CLAIM_PENDING" | "RESOLVED" | "CLOSED";
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    type: { type: String, enum: ["LOST", "FOUND"], required: true },
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    approximateTime: { type: String },
    color: { type: String },
    brand: { type: String },
    itemModel: { type: String },
    distinguishingFeatures: { type: String },
    serialNumber: { type: String },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "CLAIM_PENDING", "RESOLVED", "CLOSED"],
      default: "ACTIVE",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

ItemSchema.index({ type: 1, status: 1 });
ItemSchema.index({ userId: 1 });
ItemSchema.index({ itemName: "text", description: "text" });

export const Item: Model<IItem> = models.Item || mongoose.model<IItem>("Item", ItemSchema);
