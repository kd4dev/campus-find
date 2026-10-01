"use server";

import connectToDatabase from "../mongodb";
import { Item } from "../models/Item";
import { getCurrentDbUser } from "./user.actions";
import { redirect } from "next/navigation";

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
  
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const items = await Item.find(query).sort({ createdAt: -1 }).limit(50).populate("userId", "name avatar");
  return JSON.parse(JSON.stringify(items));
}

export async function getItemById(id: string) {
  await connectToDatabase();
  const item = await Item.findById(id).populate("userId", "name avatar");
  return JSON.parse(JSON.stringify(item));
}
