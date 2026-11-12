import { pageMetadata } from "@/lib/page-metadata";
import { OtherFileCompressorTwo } from "@/components/other-file-compressor-two";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/file-compressor-2")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/file-compressor-2",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherFileCompressorTwoPage({
  searchParams,
}: PageProps) {
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
      <OtherFileCompressorTwo />
    </BuildExperience>
  );
}
