import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayArabic } from "@/components/birthday-arabic";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/arabic")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/arabic",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function FormArabicPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/form"
      contentClassName="max-w-3xl"
      creatorInline
      YearPicker={BirthdayArabic}
    >
      <BirthdayArabic />
    </BuildExperience>
  );
}
