import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

import DocumentRenderer from '../../../../components/document-renderer';
import { reader } from '../../../../utils/reader';
import ActionButton from '../../../../components/action-button';
import { GlobeIcon } from '../../../../components/icons/globe';
import { GitHubOutlineIcon } from '../../../../components/icons/github-outline-icon';

export default async function Docs({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = await reader.collections.projects.read(slug);
  if (!project) notFound();
  const content = await project.content();

  // Project navigation
  const allProjects = await reader.collections.projects.all();
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
    <>
      <header className="mt-10">
        <div className="flex items-center justify-between">
          {/* Previous project */}

          <Link
            href={`/showcase/${previousProject.slug}`}
            className="group flex flex-col gap-6 rounded-md"
          >
            <span className="font-medium text-slate-600">&larr; Previous</span>
            <span className="text-lg font-bold group-hover:underline">
              {previousProject.entry.title}
            </span>
          </Link>
          <div className="text-center">
            <Link href="/showcase" className="font-medium hover:underline">
              Showcase
            </Link>
            <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl md:text-5xl">
              {project.title}
            </h1>
          </div>
          {/* Next project */}
          <Link
            href={`/showcase/${previousProject.slug}`}
            className="group flex flex-col gap-6 rounded-md"
          >
            <span className="font-medium text-slate-600">Next &rarr;</span>
            <span className="text-lg font-bold group-hover:underline">
              {nextProject.entry.title}
            </span>
          </Link>
        </div>

        <div className="border-b-2 lg:mx-20">
          <div className="relative mx-16 mt-20 aspect-[16/10] overflow-hidden rounded-t-2xl border-2 border-b-0">
            {/* Window buttons fake UI */}
            <div
              className="absolute left-4 top-4 z-10 flex gap-2"
              aria-hidden="true"
            >
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <Image
              src={project.coverImage}
              layout="fill"
              alt=""
              className="absolute inset-0 object-cover"
            />
          </div>
        </div>

        {/* <Badge type={data.type} transition:name={`badge-${slug}`} /> */}
        <div className="mt-16 flex justify-between gap-10">
          <p className="font-medium md:text-lg">{project.summary}</p>
          <div className="flex shrink-0 items-start gap-2">
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
          <hr className="mx-auto mt-16 w-20" />
          <main className="bg-white py-12">
            <div className="prose mx-auto px-4 lg:prose-lg sm:px-6 lg:px-8">
              <DocumentRenderer document={content} slug={slug} />
            </div>
          </main>
        </>
      )}
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await reader.collections.projects.list();

  return slugs.map(slug => ({
    slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const project = await reader.collections.projects.read(slug);

  const parentTitle = (await parent).title ?? 'Showcase';
  const title = project?.title ?? parentTitle;

  const fallbackDescription = 'A project built with Keystatic';
  const description = project?.summary ? project.summary : fallbackDescription;

  const image = `/og?title=${title}`;
  const parentTwitterSite = (await parent).twitter?.site ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keystatic.com/showcase/${slug}`,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: parentTwitterSite,
    },
  };
}
