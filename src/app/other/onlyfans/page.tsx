import { pageMetadata } from "@/lib/page-metadata";
import { OtherOnlyfans } from "@/components/other-onlyfans";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/onlyfans")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/onlyfans",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherOnlyfansPage({ searchParams }: PageProps) {
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
      <OtherOnlyfans />
    </BuildExperience>
  );
}
