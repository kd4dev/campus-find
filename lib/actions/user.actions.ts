"use server";

import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "../mongodb";
import { User } from "../models/User";

export async function syncCurrentUser() {
  try {
    const user = await currentUser();
    if (!user) return null;

    await connectToDatabase();

    const primaryEmail = user.emailAddresses?.[0]?.emailAddress || `${user.id}@student.college.edu`;
    const name =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      user.username ||
      primaryEmail.split('@')[0] ||
      "College Student";

    // Check if user already exists by clerkUserId OR email
    let dbUser = await User.findOne({
      $or: [
        { clerkUserId: user.id },
        { email: primaryEmail }
      ]
    });

    if (dbUser) {
      dbUser.clerkUserId = user.id;
      dbUser.name = name;
      dbUser.email = primaryEmail;
      dbUser.avatar = user.imageUrl || (typeof dbUser.avatar === 'string' ? dbUser.avatar : '') || '';
      if (!['USER', 'ADMIN'].includes(dbUser.role)) {
        dbUser.role = 'USER';
      }
      await dbUser.save();
    } else {
      dbUser = await User.create({
        clerkUserId: user.id,
        name,
        email: primaryEmail,
        avatar: user.imageUrl || "",
        role: "USER"
      });
    }

    return JSON.parse(JSON.stringify(dbUser));
  } catch (error) {
    console.error("Error in syncCurrentUser:", error);
    return null;
  }
}

export async function getCurrentDbUser() {
  try {
    const user = await currentUser();
    if (!user) return null;

    await connectToDatabase();

    const primaryEmail = user.emailAddresses?.[0]?.emailAddress;

    // Check for user by clerkUserId or email
    let dbUser = await User.findOne({
      $or: [
        { clerkUserId: user.id },
        ...(primaryEmail ? [{ email: primaryEmail }] : [])
      ]
    });

    if (!dbUser || dbUser.clerkUserId !== user.id) {
      return await syncCurrentUser();
    }

    return JSON.parse(JSON.stringify(dbUser));
  } catch (error) {
    console.error("Error in getCurrentDbUser:", error);
    return null;
  }
}
