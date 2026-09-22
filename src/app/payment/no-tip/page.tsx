import { pageMetadata } from "@/lib/page-metadata";
import { PaymentNoTip } from "@/components/payment-no-tip";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("payment/no-tip")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/payment/no-tip",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function PaymentNoTipPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/payment"
      contentClassName="max-w-lg"
    >
      <PaymentNoTip />
    </BuildExperience>
  );
}
