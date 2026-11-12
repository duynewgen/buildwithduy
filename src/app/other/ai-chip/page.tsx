import { pageMetadata } from "@/lib/page-metadata";
import { OtherAiChip } from "@/components/other-ai-chip";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/ai-chip")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/ai-chip",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherAiChipPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/other"
      contentClassName="max-w-5xl"
      alignTop
    >
      <OtherAiChip />
    </BuildExperience>
  );
}
