import { notFound } from "next/navigation";
import { FormBuildPage } from "@/components/form-build-page";
import { formShellFromType } from "@/lib/creator";
import { pageMetadata } from "@/lib/page-metadata";
import { formExperiments, formSlugs, getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

type PageProps = {
  params: Promise<{ build: string }>;
  searchParams: Promise<{
    creator?: string | string[];
    type?: string | string[];
  }>;
};

export function generateStaticParams() {
  return formSlugs.map((build) => ({ build }));
}

export async function generateMetadata({ params }: PageProps) {
  const { build } = await params;
  const entry = getBuildByPath(`form/${build}`);
  if (!entry) return {};
  return pageMetadata({
    title: entry.title,
    description: entry.description,
    path: `/form/${build}`,
  });
}

export default async function FormBuildRoute({
  params,
  searchParams,
}: PageProps) {
  const { build } = await params;
  const experiment = formExperiments.find((item) => item.slug === build);
  if (!experiment) notFound();
  const query = await searchParams;

  return (
    <FormBuildPage
      shell={formShellFromType(query.type)}
      experiment={experiment}
      creator={isCreatorMode(query.creator)}
    />
  );
}
