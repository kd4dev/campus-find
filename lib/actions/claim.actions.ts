"use server";

import mongoose from "mongoose";
import connectToDatabase from "../mongodb";
import { Claim } from "../models/Claim";
import { Item } from "../models/Item";
import { Conversation } from "../models/Conversation";
import { Notification } from "../models/Notification";
import { getCurrentDbUser } from "./user.actions";

export async function createClaim(data: any) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized: Please sign in first");

  if (!data.itemId || !mongoose.Types.ObjectId.isValid(data.itemId)) {
    throw new Error("Invalid item ID");
  }

  await connectToDatabase();

  const item = await Item.findById(data.itemId);
  if (!item) throw new Error("Item not found");

  const claimantId = data.claimantId?.toString() || (data.type === 'FOUND' ? user._id.toString() : item.userId.toString());
  const finderId = data.finderId?.toString() || (data.type === 'FOUND' ? item.userId.toString() : user._id.toString());

  if (claimantId === finderId) {
    throw new Error("You cannot claim an item you reported yourself");
  }

  if (!mongoose.Types.ObjectId.isValid(claimantId) || !mongoose.Types.ObjectId.isValid(finderId)) {
    throw new Error("Invalid user IDs for claim");
  }

  const existingClaim = await Claim.findOne({
    itemId: data.itemId,
    claimantId,
    finderId,
  });

  if (existingClaim) {
    return JSON.parse(JSON.stringify(existingClaim));
  }

  const claim = await Claim.create({
    itemId: data.itemId,
    claimantId,
    finderId,
    status: "PENDING",
  });

  // Create or find conversation
  const existingConv = await Conversation.findOne({
    itemId: data.itemId,
    participants: { $all: [claimantId, finderId] }
  });

  if (!existingConv) {
    await Conversation.create({
      claimId: claim._id,
      itemId: data.itemId,
      participants: [claimantId, finderId],
    });
  } else if (!existingConv.claimId) {
    existingConv.claimId = claim._id;
    await existingConv.save();
  }

  await Item.findByIdAndUpdate(data.itemId, { status: "CLAIM_PENDING" });

  // Notify the OTHER person
  const notifyUserId = data.type === 'LOST' ? claimantId : finderId;

  try {
    if (notifyUserId && mongoose.Types.ObjectId.isValid(notifyUserId)) {
      await Notification.create({
        userId: notifyUserId,
        type: "NEW_CLAIM",
        title: "New Update on Your Item!",
        message: `Someone has responded to your post for: ${item.itemName}`,
        link: `/claims/${claim._id}`
      });
    }
  } catch (notifErr) {
    console.error("Failed to create claim notification:", notifErr);
  }

  return JSON.parse(JSON.stringify(claim));
}

export async function getClaimById(id: string) {
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  try {
    await connectToDatabase();
    const claim = await Claim.findById(id)
      .populate("itemId")
      .populate("claimantId", "name avatar email")
      .populate("finderId", "name avatar email");
      
    if (!claim) return null;
    return JSON.parse(JSON.stringify(claim));
  } catch (error) {
    console.error("Error in getClaimById:", error);
    return null;
  }
}

export async function updateClaimStatus(id: string, status: string, proofData?: any) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid claim ID");
  }

  await connectToDatabase();
  const updateData: any = { status };
  
  if (proofData) {
    updateData.proofDescription = proofData.description;
    updateData.proofFiles = proofData.files;
  }

  const claim = await Claim.findByIdAndUpdate(id, updateData, { new: true }).populate("itemId");
  
  if (!claim) throw new Error("Claim not found");

  let notifyUserId = null;
  let title = "";
  let message = "";

  if (status === "PROOF_SUBMITTED") {
    notifyUserId = claim.finderId;
    title = "Proof Submitted";
    message = "The claimant has submitted ownership proof for you to review.";
  } else if (status === "APPROVED") {
    notifyUserId = claim.claimantId;
    title = "Proof Approved!";
    message = "Your proof was approved. Coordinate a meeting for handover.";
  } else if (status === "REJECTED") {
    notifyUserId = claim.claimantId;
    title = "Proof Rejected";
    message = "Your ownership proof was rejected by the finder.";
  }

  if (notifyUserId && mongoose.Types.ObjectId.isValid(notifyUserId.toString())) {
    try {
      await Notification.create({
        userId: notifyUserId,
        type: "CLAIM_UPDATE",
        title,
        message,
        link: `/claims/${claim._id}`
      });
    } catch (notifErr) {
      console.error("Failed to create status update notification:", notifErr);
    }
  }

  return JSON.parse(JSON.stringify(claim));
}
