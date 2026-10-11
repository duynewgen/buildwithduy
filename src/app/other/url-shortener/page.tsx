import { pageMetadata } from "@/lib/page-metadata";
import { OtherUrlShortener } from "@/components/other-url-shortener";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/url-shortener")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/url-shortener",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherUrlShortenerPage({
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
      <OtherUrlShortener />
    </BuildExperience>
  );
}
