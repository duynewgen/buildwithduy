import { pageMetadata } from "@/lib/page-metadata";
import { OtherGoogleAi } from "@/components/other-google-ai";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/google-ai-name")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/google-ai-name",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherGoogleAiNamePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/other"
      contentClassName="max-w-2xl"
    >
      <OtherGoogleAi />
    </BuildExperience>
  );
}
