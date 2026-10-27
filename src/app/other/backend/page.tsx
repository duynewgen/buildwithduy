import { pageMetadata } from "@/lib/page-metadata";
import { OtherBackend } from "@/components/other-backend";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/backend")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/backend",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherBackendPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/other"
      contentClassName="max-w-6xl"
    >
      <OtherBackend />
    </BuildExperience>
  );
}
