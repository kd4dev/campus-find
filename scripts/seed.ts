import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { User } from "../lib/models/User";
import { Item } from "../lib/models/Item";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env.local");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing
    await User.deleteMany({});
    await Item.deleteMany({});

    // Create a dummy user
    const user = await User.create({
      clerkUserId: "user_2test123",
      name: "Demo Student",
      email: "student@college.edu",
      role: "USER"
    });

    console.log("Created user:", user._id);

    const items = [
      {
        type: "LOST",
        itemName: "Black Wallet",
        category: "Wallet",
        description: "Lost my black leather wallet, contains my ID.",
        location: "Library 2nd Floor",
        date: new Date(),
        status: "ACTIVE",
        userId: user._id,
        images: []
      },
      {
        type: "FOUND",
        itemName: "AirPods Pro",
        category: "Electronics",
        description: "Found a pair of AirPods in a white case.",
        location: "Cafeteria",
        date: new Date(),
        status: "ACTIVE",
        distinguishingFeatures: "Small scratch on the back",
        userId: user._id,
        images: []
      }
    ];

    await Item.insertMany(items);
    console.log("Created seed items");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
