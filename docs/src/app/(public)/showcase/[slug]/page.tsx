import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

import { reader } from '../../../../utils/reader';
import ActionButton from '../../../../components/action-button';
import { GlobeIcon } from '../../../../components/icons/globe';
import { GitHubOutlineIcon } from '../../../../components/icons/github-outline-icon';
import { MarkdocRenderer } from '../../../../components/markdoc-renderer';
import { CloudImage } from '../../../../components/cloud-image';

export default async function Docs(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const project = await reader().collections.projects.read(slug);
  if (!project) notFound();
  const content = await project.content();

  // Project navigation
  const allProjects = await reader().collections.projects.all();
  const sortedProjects = allProjects.sort(
    (a, b) => (a.entry.sortIndex as number) - (b.entry.sortIndex as number)
  );
  const currentProjectIndex = sortedProjects.findIndex(p => p.slug === slug);
  const previousProject =
    currentProjectIndex > 0
      ? sortedProjects[currentProjectIndex - 1]
      : sortedProjects[sortedProjects.length - 1];
  const nextProject =
    currentProjectIndex < sortedProjects.length - 1
      ? sortedProjects[currentProjectIndex + 1]
      : sortedProjects[0];

  return (
    <div className="py-10 pt-24">
      <header>
        <div className="grid grid-cols-2 items-end gap-12 md:grid-cols-[1fr,auto,1fr]">
          {/* Previous project */}

          <Link
            href={`/showcase/${previousProject.slug}`}
            className="group mb-2 flex flex-col gap-6"
          >
            <span className="font-medium leading-none text-sand-9">
              &larr; Previous
            </span>
            <span className="text-lg font-medium leading-none group-hover:underline">
              {previousProject.entry.title}
            </span>
          </Link>
          {/* Current project */}
          <div className="col-span-2 row-start-1 text-center md:col-span-1 md:col-start-2">
            <Link
              href="/showcase"
              className="font-medium text-sand-11 hover:underline"
            >
              Showcase
            </Link>
            <h1 className="mt-2 text-3xl font-medium leading-none sm:text-4xl md:mt-4 md:text-5xl lg:mt-6">
              {project.title}
            </h1>
          </div>
          {/* Next project */}
          <Link
            href={`/showcase/${nextProject.slug}`}
            className="group mb-2 flex flex-col gap-6 justify-self-end rounded-md text-right"
          >
            <span className="font-medium leading-none text-sand-9">
              Next &rarr;
            </span>
            <span className="text-lg font-medium leading-none group-hover:underline">
              {nextProject.entry.title}
            </span>
          </Link>
        </div>

        <div className="border-b-2 border-sand-5">
          <div className="relative mt-8 aspect-[16/10.5] overflow-hidden rounded-t-2xl border-2 border-b-0 border-sand-5 md:mt-16 lg:mx-20">
            {/* Window buttons fake UI */}
            <div
              className="absolute left-2.5 top-2.5 z-10 flex gap-1.5"
              aria-hidden="true"
            >
              <div className="h-3 w-3 rounded-full bg-[#E54D2E]" />
              <div className="h-3 w-3 rounded-full bg-[#FFB224]" />
              <div className="h-3 w-3 rounded-full bg-[#30A46C]" />
            </div>
            <CloudImage
              src={project.coverImage.src}
              alt=""
              className="absolute inset-0 h-full w-full origin-bottom object-cover"
            />
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl [text-wrap:balance]">
          <p className="text-center md:text-lg">{project.summary}</p>
          <div className="mt-10 flex items-center justify-center gap-2">
            {project.repoUrl && (
              <ActionButton
                impact="light"
                href={project.repoUrl}
                icon={GitHubOutlineIcon}
              >
                View on GitHub
              </ActionButton>
            )}
            {project.url && (
              <ActionButton href={project.url ?? ''} icon={GlobeIcon}>
                Visit website
              </ActionButton>
            )}
          </div>
        </div>
      </header>

      {content && (
        <>
          <hr className="mx-auto mt-16 w-20 border-sand-5" />
          <main className="bg-white py-12">
            <div className="prose mx-auto px-4 lg:prose-lg sm:px-6 lg:px-8">
              <MarkdocRenderer node={content.node} />
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await reader().collections.projects.list();

  return slugs.map(slug => ({
    slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const project = await reader().collections.projects.read(slug);

  const parentTitle = (await parent).title ?? 'Showcase';
  const title = project?.title ?? parentTitle;

  const fallbackDescription = 'A project built with Keystatic';
  const description = project?.summary ? project.summary : fallbackDescription;

  const parentTwitterSite = (await parent).twitter?.site ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keystatic.com/showcase/${slug}`,
      type: 'website',
      images: [{ url: `/og/showcase/${slug}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: parentTwitterSite,
    },
  };
}
