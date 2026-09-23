import { pageMetadata } from "@/lib/page-metadata";
import { CategoryDirectory } from "@/components/category-directory";
import { getCategory } from "@/lib/builds";

const category = getCategory("authentication")!;

export const metadata = pageMetadata({
  title: category.id,
  description: category.description,
  path: "/authentication",
});

export default function AuthenticationPage() {
  return <CategoryDirectory category={category.id} />;
}
