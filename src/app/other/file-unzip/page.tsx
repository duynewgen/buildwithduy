import { pageMetadata } from "@/lib/page-metadata";
import { OtherFileUnzip } from "@/components/other-file-unzip";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/file-unzip")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/file-unzip",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherFileUnzipPage({ searchParams }: PageProps) {
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
      <OtherFileUnzip />
    </BuildExperience>
  );
}
