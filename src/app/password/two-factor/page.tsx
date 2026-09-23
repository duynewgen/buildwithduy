import { pageMetadata } from "@/lib/page-metadata";
import { PasswordTwoFactor } from "@/components/password-two-factor";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("password/two-factor")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/password/two-factor",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function PasswordTwoFactorPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/password"
      contentClassName="max-w-lg"
    >
      <PasswordTwoFactor />
    </BuildExperience>
  );
}
