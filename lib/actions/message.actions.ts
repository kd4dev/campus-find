"use server";

import connectToDatabase from "../mongodb";
import { Conversation } from "../models/Conversation";
import { getCurrentDbUser } from "./user.actions";

export async function getUserConversations() {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();

  const conversations = await Conversation.find({ participants: user._id })
    .populate("participants", "name avatar")
    .populate("itemId", "itemName type images")
    .sort({ lastMessageAt: -1 });

  return JSON.parse(JSON.stringify(conversations));
}

export async function getConversationById(id: string) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();
  
  const conversation = await Conversation.findById(id)
    .populate("participants", "name avatar")
    .populate("itemId", "itemName");
    
  if (!conversation || !conversation.participants.some((p: any) => p._id.toString() === user._id.toString())) {
    return null;
  }

  return JSON.parse(JSON.stringify(conversation));
}

export async function getConversationByClaimId(claimId: string) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();
  
  const conversation = await Conversation.findOne({ claimId })
    .populate("participants", "name avatar")
    .populate("itemId", "itemName");
    
  if (!conversation || !conversation.participants.some((p: any) => p._id.toString() === user._id.toString())) {
    return null;
  }

  return JSON.parse(JSON.stringify(conversation));
}
