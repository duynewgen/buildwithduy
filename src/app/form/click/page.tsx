import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayClick } from "@/components/birthday-click";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("birthday/click")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/birthday/click",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayClickPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-md"
      YearPicker={BirthdayClick}
    >
      <BirthdayClick />
    </BuildExperience>
  );
}
