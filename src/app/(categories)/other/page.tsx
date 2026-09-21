import type { Metadata } from "next";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("other")!;

export const metadata: Metadata = {
  title: category.id,
  description: category.description,
};

export default function OtherPage() {
  return <CategoryDirectory category={category.id} />;
}
