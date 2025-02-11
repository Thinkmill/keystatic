import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import slugify from '@sindresorhus/slugify';

import { EditOnGitHub } from '../../../../components/navigation/edit-on-github';
import { TableOfContents } from '../../../../components/navigation/table-of-contents';
import { reader } from '../../../../utils/reader';
import { H1_ID } from '../../../../constants';
import { MarkdocRenderer } from '../../../../components/markdoc-renderer';
import { RenderableTreeNode, Tag } from '@markdoc/markdoc';
import { transformMarkdoc } from '../../../../../keystatic.config';

type DocsProps = {
  params: Promise<{ slug: string[] }>;
};

function stringifyDocContent(node: RenderableTreeNode): string {
  if (typeof node === 'string') {
    return node;
  }
  if (node === null || !Tag.isTag(node)) {
    return '';
  }
  return node.children.map(stringifyDocContent).join('');
}

export const dynamicParams = false;

export default async function Docs(props: DocsProps) {
  const params = await props.params;
  const { slug: slugPath } = params;

  const slug = slugPath.join('/');
  const page = await reader().collections.pages.read(slug);

  if (!page) notFound();

  // Filter headings from the document content
  const headingsFromContent = (
    transformMarkdoc((await page.content()).node) as Tag
  ).children
    .filter(
      (child): child is Tag => Tag.isTag(child) && child.name === 'Heading'
    )
    .map(heading => ({
      level: heading.attributes.level as number,
      text: stringifyDocContent(heading),
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
          <MarkdocRenderer node={(await page.content()).node} />
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
  props: DocsProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slugPath = params.slug;
  const slug = slugPath.join('/');

  const page = await reader().collections.pages.read(slug);

  const parentTitle = (await parent).title ?? 'Docs';
  const title = page?.title ?? parentTitle;

  const fallbackDescription = 'Documentation page for Keystatic.';
  const description = page?.summary ? page.summary : fallbackDescription;

  const parentTwitterSite = (await parent).twitter?.site ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keystatic.com/docs/${slug}`,
      type: 'website',
      images: [{ url: `/og/docs/${slug}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: parentTwitterSite,
    },
  };
}
