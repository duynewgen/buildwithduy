import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayMorse } from "@/components/birthday-morse";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/morse")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/morse",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function FormMorsePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/form"
      contentClassName="max-w-lg"
      prompt="age"
      YearPicker={BirthdayMorse}
    >
      <BirthdayMorse />
    </BuildExperience>
  );
}
