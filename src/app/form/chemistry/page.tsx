import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayChemistry } from "@/components/birthday-chemistry";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/chemistry")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/chemistry",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function FormChemistryPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/form"
      contentClassName="max-w-3xl"
      creatorInline
      prompt="age"
      YearPicker={BirthdayChemistry}
    >
      <BirthdayChemistry />
    </BuildExperience>
  );
}
