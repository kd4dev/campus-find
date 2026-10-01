import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IUser extends Document {
  clerkUserId: string;
  name: string;
  email: string;
  avatar?: string;
  college?: string;
  phone?: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    college: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

export const User: Model<IUser> = models.User || mongoose.model<IUser>("User", UserSchema);
