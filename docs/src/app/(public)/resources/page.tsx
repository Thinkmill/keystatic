import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { EntryWithResolvedLinkedFiles } from '@keystatic/core/reader';

import { ArrowRightIcon } from '../../../components/icons/arrow-right';
import { reader } from '../../../utils/reader';
import keystaticConfig from '../../../../keystatic.config';
import Button from '../../../components/button';

type Resource = {
  slug: string;
  entry: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['collections']['resources']
  >;
};

export default async function Resources() {
  const resources: Resource[] = await reader().collections.resources.all();

  if (!resources) notFound();

  const sortedVideos = resources
    .filter(resource => resource.entry.type.discriminant === 'youtube-video')
    .sort((a, b) => {
      return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
    })
    .map(resource => ({
      title: resource.entry.title,
      sortIndex: resource.entry.sortIndex,
      ...resource.entry.type.value,
    }));

  const sortedTalks = resources
    .filter(resource => resource.entry.type.discriminant === 'talk')
    .sort((a, b) => {
      return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
    })
    .map(resource => ({
      title: resource.entry.title,
      sortIndex: resource.entry.sortIndex,
      ...resource.entry.type.value,
    }));

  const sortedArticles = resources
    .filter(resource => resource.entry.type.discriminant === 'article')
    .sort((a, b) => {
      return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
    })
    .map(resource => ({
      title: resource.entry.title,
      sortIndex: resource.entry.sortIndex,
      ...resource.entry.type.value,
    }));

  return (
    <div className="mt-24 pt-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-medium md:text-5xl">Resources</h1>
        <div className="mt-6 space-y-4 text-lg">
          <p>
            A collection of videos, talks, articles and other resources to help
            you learn Keystatic and dig deeper.
          </p>
        </div>
      </header>

      <div className="mt-12 divide-y divide-slate-5">
        <ResourceSection title="YouTube Videos">
          <p>
            The{' '}
            <Link
              href="https://youtube.com/@thinkmill"
              className="underline hover:no-underline"
            >
              Thinkmill channel
            </Link>{' '}
            has a growing collection of content about Keystatic.
          </p>
          <ResourceGrid>
            {sortedVideos.map(video => (
              <YouTubeResource
                videoId={video.videoId as string}
                title={video.title}
                description={video.description as string}
              />
            ))}
          </ResourceGrid>
          <Button
            variant="regular"
            impact="light"
            className="mt-12 inline-flex items-center gap-2"
            href="https://www.youtube.com/playlist?list=PLYyvXL46d-pzqwOKdofd5aKiqPTAN3ql6"
          >
            <span>Watch more videos</span>
            <ArrowRightIcon />
          </Button>
        </ResourceSection>
        <ResourceSection title="Talks">
          <p>Recorded Keystatic talks from local meetups and conferences.</p>
          <ResourceGrid>
            {sortedTalks.map(video => (
              <YouTubeResource
                videoId={video.videoId as string}
                title={video.title}
                description={video.description as string}
              />
            ))}
          </ResourceGrid>
        </ResourceSection>
        <ResourceSection title="Articles">
          <ResourceGrid>
            {sortedArticles.map(article => (
              <li className="mb-4 mr-4">
                <h3 className="text-xl font-medium">
                  <Link href={article.url} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-10">
                  by {article.authorName}
                </p>
                <p className="mt-4">{article.description}</p>
              </li>
            ))}
          </ResourceGrid>
        </ResourceSection>

        <ResourceSection>
          <div className="inline-flex flex-col gap-4 rounded-lg bg-slate-3 px-4 py-6 sm:flex-row">
            <div className="flex h-6 items-center text-3xl">⏳</div>
            <div className="flex flex-col gap-3">
              <p className="text-md text-slate-12">
                This page is a work in progress — more resources coming soon!
              </p>
            </div>
          </div>
        </ResourceSection>
      </div>
    </div>
  );
}

type YouTubeResourceProps = {
  videoId: string;
  title: string;
  description: string;
};

function YouTubeResource({
  videoId,
  title,
  description,
}: YouTubeResourceProps) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const videoThumbnailUrl = `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  return (
    <li>
      <Link
        href={videoUrl}
        className="group relative block aspect-video w-full"
      >
        <Image
          fill
          src={videoThumbnailUrl}
          alt=""
          className="h-full-w-full absolute inset-0 rounded-lg shadow-md transition-shadow group-hover:shadow-sm"
        />
      </Link>
      <h3 className="mt-6 text-xl font-medium">
        <Link href={videoUrl} className="hover:underline">
          {title}
        </Link>
      </h3>
      <p className="mt-2">{description}</p>
    </li>
  );
}

type ResourceGridProps = {
  children: React.ReactNode;
};

function ResourceGrid({ children }: ResourceGridProps) {
  return (
    <ul className="mt-8 grid items-start gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </ul>
  );
}

type ResourceSectionProps = {
  title?: string | React.ReactNode;
  introText?: string;
  children: React.ReactNode;
};

function ResourceSection({ title, children }: ResourceSectionProps) {
  return (
    <section className="py-16">
      {title && <h2 className="mb-4 text-2xl font-medium">{title}</h2>}
      {children}
    </section>
  );
}
