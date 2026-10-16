import { redirect } from "next/navigation";

export default function ItemsFoundPage() {
  redirect("/items?type=FOUND");
}
