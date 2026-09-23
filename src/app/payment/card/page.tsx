import { pageMetadata } from "@/lib/page-metadata";
import { PaymentCard } from "@/components/payment-card";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("payment/card")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/payment/card",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function PaymentCardPage({ searchParams }: PageProps) {
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
      <PaymentCard />
    </BuildExperience>
  );
}
