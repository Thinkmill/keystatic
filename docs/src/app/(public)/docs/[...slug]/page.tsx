import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import slugify from '@sindresorhus/slugify';

import { EditOnGitHub } from '../../../../components/navigation/edit-on-github';
import { TableOfContents } from '../../../../components/navigation/table-of-contents';
import DocumentRenderer from '../../../../components/document-renderer';
import { reader } from '../../../../utils/reader';
import { H1_ID } from '../../../../constants';

type DocsProps = {
  params: { slug: string[] };
};

export default async function Docs({ params }: DocsProps) {
  const { slug: slugPath } = params;

  const slug = slugPath.join('/');
  const page = await reader().collections.pages.read(slug);

  if (!page) notFound();

  // Filter headings from the document content
  const headingsFromContent = (await page.content())
    .filter(child => child.type === 'heading')
    .map(heading => ({
      level: heading.level as number,
      text: heading.children.find(child => child.text)?.text as string,
    }))
    .filter(heading => heading.text);

  // Add slug
  const headingsWithSlugs = headingsFromContent.map(({ level, text }) => {
    return {
      level,
      text,
      slug: `#${slugify(text)}`,
    };
  });

  // Manually add the persistent #${H1_ID} heading, to send to TOCs
  const overviewHeading = {
    level: 1,
    text: 'Overview',
    slug: `#${H1_ID}`,
  };
  const headings = [overviewHeading, ...headingsWithSlugs];

  return (
    <div className="grid grid-cols-[auto] gap-6 md:grid-cols-[auto,12rem]">
      <div>
        <h1
          id={H1_ID}
          className="mb-8 scroll-mt-[7rem] text-3xl font-extrabold"
        >
          {page.title}
        </h1>
        <div className="flex flex-col gap-4 [&_a]:break-words">
          <DocumentRenderer document={await page.content()} />
        </div>
      </div>
      <div className="sticky top-10 hidden w-[12rem] self-start md:block lg:top-32">
        <TableOfContents headings={headings} />
        <EditOnGitHub slug={slug} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await reader().collections.pages.list();

  return slugs.map(slug => ({
    slug: slug.split('/'),
  }));
}

export async function generateMetadata(
  { params }: DocsProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slugPath = params.slug;
  const slug = slugPath.join('/');

  const page = await reader().collections.pages.read(slug);

  const parentTitle = (await parent).title ?? 'Docs';
  const title = page?.title ?? parentTitle;

  const fallbackDescription = 'Documentation page for Keystatic.';
  const description = page?.summary ? page.summary : fallbackDescription;

  const image = `/og?title=${title}`;
  const parentTwitterSite = (await parent).twitter?.site ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keystatic.com/docs/${slug}`,
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
