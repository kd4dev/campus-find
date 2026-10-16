"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "../mongodb";
import { User } from "../models/User";

export async function syncCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  await connectToDatabase();

  const primaryEmail = user.emailAddresses?.[0]?.emailAddress || `${user.id}@student.college.edu`;
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || primaryEmail.split('@')[0] || "College Student";

  const dbUser = await User.findOneAndUpdate(
    { clerkUserId: user.id },
    {
      $set: {
        name,
        email: primaryEmail,
        avatar: user.imageUrl || "",
      },
      $setOnInsert: {
        role: "USER"
      }
    },
    { upsert: true, new: true }
  );

  return JSON.parse(JSON.stringify(dbUser));
}

export async function getCurrentDbUser() {
  const user = await currentUser();
  if (!user) return null;

  await connectToDatabase();
  const dbUser = await User.findOne({ clerkUserId: user.id });
  
  if (!dbUser) {
    return await syncCurrentUser();
  }
  
  return JSON.parse(JSON.stringify(dbUser));
}
