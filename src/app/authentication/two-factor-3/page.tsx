import { pageMetadata } from "@/lib/page-metadata";
import { PasswordTwoFactorThree } from "@/components/password-two-factor-three";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("authentication/two-factor-3")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/authentication/two-factor-3",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function AuthenticationTwoFactorThreePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/authentication"
      contentClassName="max-w-lg"
    >
      <PasswordTwoFactorThree />
    </BuildExperience>
  );
}
