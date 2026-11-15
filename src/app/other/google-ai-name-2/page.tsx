import { pageMetadata } from "@/lib/page-metadata";
import { OtherGoogleAiTwo } from "@/components/other-google-ai-two";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/google-ai-name-2")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/google-ai-name-2",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherGoogleAiNameTwoPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/other"
      contentClassName="w-full"
      fullBleed
    >
      <OtherGoogleAiTwo />
    </BuildExperience>
  );
}
