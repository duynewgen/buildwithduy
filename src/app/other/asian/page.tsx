import { pageMetadata } from "@/lib/page-metadata";
import { OtherAsian } from "@/components/other-asian";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/asian")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/asian",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherAsianPage({ searchParams }: PageProps) {
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
      <OtherAsian />
    </BuildExperience>
  );
}
