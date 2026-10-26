import { pageMetadata } from "@/lib/page-metadata";
import { OtherFoodScanner } from "@/components/other-food-scanner";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/food-scanner")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/food-scanner",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherFoodScannerPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/other"
      contentClassName="max-w-lg"
    >
      <OtherFoodScanner />
    </BuildExperience>
  );
}
