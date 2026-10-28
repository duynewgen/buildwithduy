import { pageMetadata } from "@/lib/page-metadata";
import { OtherAsianParentsTranslator } from "@/components/other-asian-parents-translator";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("other/asian-parents-translator")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/other/asian-parents-translator",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function OtherAsianParentsTranslatorPage({
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
      hideBack
      alignTop
      contentClassName="max-w-7xl"
    >
      <OtherAsianParentsTranslator />
    </BuildExperience>
  );
}
