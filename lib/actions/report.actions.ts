"use server";

import mongoose from "mongoose";
import connectToDatabase from "../mongodb";
import { Report } from "../models/Report";
import { Item } from "../models/Item";
import { getCurrentDbUser } from "./user.actions";

export async function createReport(data: {
  itemId: string;
  reason: "SPAM" | "INAPPROPRIATE" | "FAKE_LISTING" | "HARASSMENT" | "OTHER";
  details?: string;
}) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized: Please sign in to report a listing");

  if (!data.itemId || !mongoose.Types.ObjectId.isValid(data.itemId)) {
    throw new Error("Invalid item ID");
  }

  await connectToDatabase();

  const item = await Item.findById(data.itemId);
  if (!item) throw new Error("Item not found");

  const existingReport = await Report.findOne({
    reporterId: user._id,
    itemId: data.itemId,
    status: "PENDING"
  });

  if (existingReport) {
    return { success: true, message: "You have already submitted a report for this listing." };
  }

  const report = await Report.create({
    reporterId: user._id,
    itemId: data.itemId,
    reason: data.reason,
    details: data.details,
    status: "PENDING",
  });

  return JSON.parse(JSON.stringify(report));
}

export async function getReports() {
  const user = await getCurrentDbUser();
  if (!user || user.role !== "ADMIN") throw new Error("Unauthorized: Admin access required");

  await connectToDatabase();

  const reports = await Report.find({})
    .populate("reporterId", "name email avatar")
    .populate("itemId", "itemName type location status")
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(reports));
}

export async function updateReportStatus(reportId: string, status: "RESOLVED" | "DISMISSED") {
  const user = await getCurrentDbUser();
  if (!user || user.role !== "ADMIN") throw new Error("Unauthorized: Admin access required");

  if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
    throw new Error("Invalid report ID");
  }

  await connectToDatabase();

  const report = await Report.findByIdAndUpdate(
    reportId,
    { status, resolvedBy: user._id },
    { new: true }
  );

  return JSON.parse(JSON.stringify(report));
}

export async function deleteReportedListing(reportId: string, itemId: string) {
  const user = await getCurrentDbUser();
  if (!user || user.role !== "ADMIN") throw new Error("Unauthorized: Admin access required");

  await connectToDatabase();

  if (itemId && mongoose.Types.ObjectId.isValid(itemId)) {
    await Item.findByIdAndDelete(itemId);
  }

  if (reportId && mongoose.Types.ObjectId.isValid(reportId)) {
    await Report.findByIdAndUpdate(reportId, { status: "RESOLVED", resolvedBy: user._id });
  }

  return { success: true };
}
