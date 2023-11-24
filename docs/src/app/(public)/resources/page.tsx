import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowRightIcon } from '../../../components/icons/arrow-right';
import { reader } from '../../../utils/reader';
import Button from '../../../components/button';
import { Entry } from '@keystatic/core/reader';
import keystaticConfig from '../../../../keystatic.config';

type ResourceEntry = Entry<
  (typeof keystaticConfig)['collections']['resources']
>;

type VideoProps = {
  title: ResourceEntry['title'];
} & Omit<
  Extract<
    Entry<(typeof keystaticConfig)['collections']['resources']>['type'],
    { discriminant: 'youtube-video' }
  >['value'],
  'kind'
>;

type ArticleProps = {
  title: ResourceEntry['title'];
} & Omit<
  Extract<
    Entry<(typeof keystaticConfig)['collections']['resources']>['type'],
    { discriminant: 'article' }
  >['value'],
  'kind'
>;

export default async function Resources() {
  const resources = await reader().collections.resources.all();
  if (!resources) notFound();

  const sortedVideos = resources
    .filter(
      resource =>
        resource.entry.type.discriminant === 'youtube-video' &&
        resource.entry.type.value.kind === 'screencast'
    )
    .sort((a, b) => {
      return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
    })
    .map(resource => ({
      title: resource.entry.title,
      sortIndex: resource.entry.sortIndex,
      ...resource.entry.type.value,
    })) as VideoProps[];

  const sortedTalks = resources
    .filter(
      resource =>
        resource.entry.type.discriminant === 'youtube-video' &&
        resource.entry.type.value.kind === 'talk'
    )
    .sort((a, b) => {
      return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
    })
    .map(resource => ({
      title: resource.entry.title,
      sortIndex: resource.entry.sortIndex,
      ...resource.entry.type.value,
    })) as VideoProps[];

  const sortedArticles = resources
    .filter(resource => resource.entry.type.discriminant === 'article')
    .sort((a, b) => {
      return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
    })
    .map(resource => ({
      title: resource.entry.title,
      sortIndex: resource.entry.sortIndex,
      ...resource.entry.type.value,
    })) as ArticleProps[];

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
        <Section title="YouTube Videos">
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
              <Video
                title={video.title}
                videoId={video.videoId}
                description={video.description}
                thumbnail={video.thumbnail}
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
        </Section>
        <Section title="Talks">
          <p>Recorded Keystatic talks from local meetups and conferences.</p>
          <ResourceGrid>
            {sortedTalks.map(video => (
              <Video
                videoId={video.videoId}
                title={video.title}
                description={video.description}
                thumbnail={video.thumbnail}
              />
            ))}
          </ResourceGrid>
        </Section>
        <Section title="Articles">
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
                {article.description && (
                  <p className="mt-4">{article.description}</p>
                )}
              </li>
            ))}
          </ResourceGrid>
        </Section>

        <Section>
          <div className="inline-flex flex-col gap-4 rounded-lg bg-slate-3 px-4 py-6 sm:flex-row">
            <div className="flex h-6 items-center text-3xl">⏳</div>
            <div className="flex flex-col gap-3">
              <p className="text-md text-slate-12">
                This page is a work in progress — more resources coming soon!
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Video({ videoId, title, description, thumbnail }: VideoProps) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  return (
    <li>
      <Link
        href={videoUrl}
        className="group relative block aspect-video w-full"
      >
        <Image
          fill
          src={thumbnail.src}
          alt={thumbnail.alt || ''}
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

function ResourceGrid(props: React.ComponentProps<'ul'>) {
  return (
    <ul
      className="mt-8 grid items-start gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
      {...props}
    />
  );
}

type SectionProps = {
  title?: string | React.ReactNode;
  introText?: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="py-16">
      {title && <h2 className="mb-4 text-2xl font-medium">{title}</h2>}
      {children}
    </section>
  );
}
