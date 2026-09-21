import { pageMetadata } from "@/lib/page-metadata";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("payment")!;

export const metadata = pageMetadata({
  title: category.id,
  description: category.description,
  path: "/payment",
});

export default function PaymentPage() {
  return <CategoryDirectory category={category.id} />;
}
