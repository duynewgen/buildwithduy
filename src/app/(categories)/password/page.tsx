import { pageMetadata } from "@/lib/page-metadata";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("password")!;

export const metadata = pageMetadata({
  title: category.id,
  description: category.description,
  path: "/password",
});

export default function PasswordPage() {
  return <CategoryDirectory category={category.id} />;
}
