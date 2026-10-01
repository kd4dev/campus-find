"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "../mongodb";
import { User } from "../models/User";

export async function syncCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  await connectToDatabase();

  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const email = user.emailAddresses[0]?.emailAddress;

  const dbUser = await User.findOneAndUpdate(
    { clerkUserId: user.id },
    {
      name,
      email,
      avatar: user.imageUrl,
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
