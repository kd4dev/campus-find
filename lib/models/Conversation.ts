import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IConversation extends Document {
  claimId?: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: "Claim" },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ itemId: 1 });

export const Conversation: Model<IConversation> = models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
