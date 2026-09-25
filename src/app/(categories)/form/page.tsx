import { pageMetadata } from "@/lib/page-metadata";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("birthday")!;

export const metadata = pageMetadata({
  title: category.id,
  description: category.description,
  path: "/birthday",
});

export default function BirthdayPage() {
  return <CategoryDirectory category={category.id} />;
}
