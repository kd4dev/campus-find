"use server";

import connectToDatabase from "../mongodb";
import { Claim } from "../models/Claim";
import { Item } from "../models/Item";
import { Conversation } from "../models/Conversation";
import { getCurrentDbUser } from "./user.actions";

export async function createClaim(data: any) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();

  // Check if a claim already exists between these users for this item
  const existingClaim = await Claim.findOne({
    itemId: data.itemId,
    claimantId: data.claimantId,
    finderId: data.finderId,
  });

  if (existingClaim) {
    return JSON.parse(JSON.stringify(existingClaim));
  }

  const claim = await Claim.create({
    itemId: data.itemId,
    claimantId: data.claimantId,
    finderId: data.finderId,
    status: "PENDING",
  });

  // Also create a conversation
  await Conversation.create({
    claimId: claim._id,
    itemId: data.itemId,
    participants: [data.claimantId, data.finderId],
  });

  // Update Item status
  await Item.findByIdAndUpdate(data.itemId, { status: "CLAIM_PENDING" });

  return JSON.parse(JSON.stringify(claim));
}

export async function getClaimById(id: string) {
  await connectToDatabase();
  const claim = await Claim.findById(id)
    .populate("itemId")
    .populate("claimantId", "name avatar email")
    .populate("finderId", "name avatar email");
    
  return JSON.parse(JSON.stringify(claim));
}

export async function updateClaimStatus(id: string, status: string, proofData?: any) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();
  const updateData: any = { status };
  
  if (proofData) {
    updateData.proofDescription = proofData.description;
    updateData.proofFiles = proofData.files;
  }

  const claim = await Claim.findByIdAndUpdate(id, updateData, { new: true });
  return JSON.parse(JSON.stringify(claim));
}
