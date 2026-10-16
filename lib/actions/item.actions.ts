"use server";

import mongoose from "mongoose";
import connectToDatabase from "../mongodb";
import { Item } from "../models/Item";
import { getCurrentDbUser } from "./user.actions";

export async function createItem(data: any) {
  const user = await getCurrentDbUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const newItem = await Item.create({
    ...data,
    userId: user._id,
  });

  return JSON.parse(JSON.stringify(newItem));
}

export async function getItems(filters: any = {}) {
  await connectToDatabase();
  const query: any = { status: "ACTIVE" };
  
  if (filters.type) query.type = filters.type.toUpperCase();
  if (filters.category) query.category = filters.category;
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const items = await Item.find(query).sort({ createdAt: -1 }).limit(50).populate("userId", "name avatar");
  return JSON.parse(JSON.stringify(items));
}

export async function getItemById(id: string) {
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  try {
    await connectToDatabase();
    const item = await Item.findById(id).populate("userId", "name avatar");
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error("Error in getItemById:", error);
    return null;
  }
}

export async function deleteItem(id: string) {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("Unauthorized");

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid item ID");
  }

  await connectToDatabase();
  const item = await Item.findById(id);
  if (!item) throw new Error("Item not found");

  if (user.role !== "ADMIN" && item.userId.toString() !== user._id.toString()) {
    throw new Error("Unauthorized to delete this item");
  }

  await Item.findByIdAndDelete(id);
  return { success: true };
}
