import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { EntryWithResolvedLinkedFiles } from '@keystatic/core/reader';

import { reader } from '../../../utils/reader';
import keystaticConfig from '../../../../keystatic.config';
import ActionButton from '../../../components/action-button';
import { GlobeIcon } from '../../../components/icons/globe';
import { GitHubOutlineIcon } from '../../../components/icons/github-outline-icon';
import { CloudImage } from '../../../components/cloud-image';

type Project = {
  slug: string;
  entry: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['collections']['projects']
  >;
};

export default async function Showcase() {
  const projects: Project[] = await reader().collections.projects.all({
    resolveLinkedFiles: true,
  });

  if (!projects) notFound();

  const sortedProjects = projects.sort((a, b) => {
    return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
  });

  // Move the first 4 projects into the highlighted section
  const highlightedProjects = sortedProjects.splice(0, 4);

  return (
    <div className="mb-20 mt-24 pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-medium md:text-5xl">
          Built with Keystatic
        </h1>
        <div className="mt-6 space-y-4 text-lg">
          <p>
            A collection of projects using Keystatic to manage parts of their
            codebase.
          </p>
          {/* TODO: Work out how we want to collect the submissions first. */}
          {/* <p>
            Built something with Keystatic?{' '}
            <Link
              className="border-b-2 border-black hover:border-transparent"
              href=""
            >
              Share your project
            </Link>
          </p> */}
        </div>
      </div>

      {/* Highlighted projects */}
      <ul className="mt-16 grid gap-6 md:grid-cols-2">
        {highlightedProjects.map(async ({ slug, entry }) => {
          return <ProjectCard entry={entry} slug={slug} />;
        })}
      </ul>

      {/* Rest of the projects */}
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProjects.map(async ({ slug, entry }) => {
          return <ProjectCard entry={entry} slug={slug} />;
        })}
      </ul>
    </div>
  );
}

function ProjectCard({ entry, slug }: Project) {
  return (
    <li className="relative flex flex-col overflow-hidden rounded-lg border border-sand-6 bg-sand-2 p-8 @container">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-x-4">
          <h2 className="text-xl font-medium group-hover:underline @sm:text-2xl">
            <Link href={`/showcase/${slug}`} className="hover:underline">
              {entry.title}
            </Link>
          </h2>
          {entry.type === 'demo' && <DemoBadge />}
        </div>
        <p className="mt-4">{entry.summary}</p>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {/* TODO: New button styles */}
          <ActionButton href={entry.url ?? ''} icon={GlobeIcon}>
            Visit
          </ActionButton>
          {entry.repoUrl && (
            <ActionButton
              impact="light"
              href={entry.repoUrl}
              icon={GitHubOutlineIcon}
            >
              View on GitHub
            </ActionButton>
          )}
        </div>
      </div>

      <div className="relative aspect-[16/10] translate-x-12 translate-y-8 @sm:translate-y-20">
        {/* Image stack effect on large cards */}
        <div className="absolute -right-8 -top-5 hidden h-full w-full rounded-xl border border-sand-6 bg-white @sm:block" />
        <div className="absolute -right-4 -top-2.5 hidden h-full w-full rounded-xl border border-sand-6 bg-white @sm:block" />

        <CloudImage
          src={entry.coverImage.src}
          alt=""
          className="absolute inset-0 w-full rounded-tl-xl object-cover @sm:border-l @sm:border-t @sm:border-sand-6"
        />
      </div>
    </li>
  );
}

function DemoBadge() {
  return (
    <span className="mt-0.5 inline-flex items-center gap-2 rounded-full border border-amber-5 bg-amber-2 px-2 py-1 text-sm font-medium text-amber-11">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
      Demo
    </span>
  );
}
