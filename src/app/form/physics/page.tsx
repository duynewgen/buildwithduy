import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayPhysics } from "@/components/birthday-physics";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/physics")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/physics",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function FormPhysicsPage({ searchParams }: PageProps) {
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
      YearPicker={BirthdayPhysics}
    >
      <BirthdayPhysics />
    </BuildExperience>
  );
}
