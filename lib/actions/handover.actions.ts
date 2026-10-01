"use server";

import connectToDatabase from "../mongodb";
import { Handover } from "../models/Handover";
import { Claim } from "../models/Claim";
import { Item } from "../models/Item";
import { getCurrentDbUser } from "./user.actions";
import crypto from "crypto";

// For demo purposes, we will store OTP in plaintext in DB (since it's a short-lived UI OTP), 
// but we call the field otpHash to match requirements, or just store it.
// In real prod, we'd hash it and send plaintext to claimant via email/sms. 
// But here, Claimant needs to see it in UI. 
export async function generateOTP(claimId: string) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();
  
  const claim = await Claim.findById(claimId);
  if (!claim || claim.finderId.toString() !== user._id.toString()) {
    throw new Error("Unauthorized or claim not found");
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 min expiry

  await Handover.create({
    claimId: claim._id,
    finderId: claim.finderId,
    claimantId: claim.claimantId,
    otpHash: otp, // Storing plaintext for simplicity in this MVP so claimant can fetch it
    expiresAt,
    status: "CREATED"
  });

  await Claim.findByIdAndUpdate(claimId, { status: "HANDOVER_PENDING" });

  return { success: true };
}

export async function verifyOTP(claimId: string, otp: string) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();

  const claim = await Claim.findById(claimId);
  if (!claim || claim.finderId.toString() !== user._id.toString()) {
    throw new Error("Unauthorized");
  }

  const handover = await Handover.findOne({ claimId, status: "CREATED" }).sort({ createdAt: -1 });
  
  if (!handover) throw new Error("No active handover found");
  
  if (handover.expiresAt < new Date()) {
    handover.status = "EXPIRED";
    await handover.save();
    throw new Error("OTP has expired");
  }

  if (handover.otpHash !== otp) {
    handover.attemptCount += 1;
    if (handover.attemptCount >= 3) {
      handover.status = "FAILED";
    }
    await handover.save();
    throw new Error("Invalid OTP");
  }

  // Success
  handover.status = "VERIFIED";
  handover.verifiedAt = new Date();
  await handover.save();

  await Claim.findByIdAndUpdate(claimId, { status: "COMPLETED" });
  await Item.findByIdAndUpdate(claim.itemId, { status: "RESOLVED" });

  return { success: true };
}

export async function getClaimantOTP(claimId: string) {
  const user = await getCurrentDbUser();
  if (!user) return null;

  await connectToDatabase();
  const handover = await Handover.findOne({ claimId, claimantId: user._id, status: "CREATED" }).sort({ createdAt: -1 });
  
  if (!handover || handover.expiresAt < new Date()) return null;
  
  return handover.otpHash;
}
