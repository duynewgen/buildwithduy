import type { Metadata } from "next";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("2fa")!;

export const metadata: Metadata = {
  title: category.id,
  description: category.description,
};

export default function TwoFaPage() {
  return <CategoryDirectory category={category.id} />;
}
