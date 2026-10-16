import { redirect } from "next/navigation";

export default function ItemsLostPage() {
  redirect("/items?type=LOST");
}
