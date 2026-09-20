import type { Metadata } from "next";
import { CategoryDirectory } from "@/components/category-directory";

export const metadata: Metadata = {
  title: "birthday",
  description: "cursed birthday selection builds.",
};

export default function BirthdayPage() {
  return <CategoryDirectory category="birthday" />;
}
