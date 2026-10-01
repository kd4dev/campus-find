"use server";

import connectToDatabase from "../mongodb";
import { Notification } from "../models/Notification";
import { getCurrentDbUser } from "./user.actions";

export async function getUserNotifications() {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  await connectToDatabase();
  const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);
  return JSON.parse(JSON.stringify(notifications));
}

export async function markNotificationsAsRead() {
  const user = await getCurrentDbUser();
  if (!user) return;

  await connectToDatabase();
  await Notification.updateMany(
    { userId: user._id, read: false },
    { $set: { read: true } }
  );
}
