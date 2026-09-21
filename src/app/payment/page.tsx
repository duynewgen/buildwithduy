import type { Metadata } from "next";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("payment")!;

export const metadata: Metadata = {
  title: category.id,
  description: category.description,
};

export default function PaymentPage() {
  return <CategoryDirectory category={category.id} />;
}
