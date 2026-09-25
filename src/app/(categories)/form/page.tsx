import { pageMetadata } from "@/lib/page-metadata";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("form")!;

export const metadata = pageMetadata({
  title: category.id,
  description: category.description,
  path: "/form",
});

export default function FormPage() {
  return <CategoryDirectory category={category.id} />;
}
