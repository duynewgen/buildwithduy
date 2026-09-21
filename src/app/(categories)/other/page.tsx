import { pageMetadata } from "@/lib/page-metadata";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("other")!;

export const metadata = pageMetadata({
  title: category.id,
  description: category.description,
  path: "/other",
});

export default function OtherPage() {
  return <CategoryDirectory category={category.id} />;
}
