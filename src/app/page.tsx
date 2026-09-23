import { pageMetadata } from "@/lib/page-metadata";
import { CategoryShell } from "@/components/category-directory";
import { ReadmeContent } from "@/components/readme-content";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <CategoryShell category="">
      <ReadmeContent />
    </CategoryShell>
  );
}
