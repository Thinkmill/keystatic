import { notFound } from 'next/navigation';
import { reader } from '../../../../utils/reader';
import Link from 'next/link';
import { parseAndFormatPublishedDate } from '../../../../utils';
import { ArrowLeftIcon } from '../../../../components/icons/arrow-left';
import { Fragment } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { H1_ID } from '../../../../constants';
import { MarkdocRenderer } from '../../../../components/markdoc-renderer';

type BlogProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export default async function BlogPost(props: BlogProps) {
  const params = await props.params;
  const { slug: slugPath } = params;
  const slug = slugPath.join('/');

  // Reads the content data for this blog post
  const blogData = await reader().collections.blog.read(slug);

  if (!blogData) notFound();

  // Gets all the authors data
  const authorData = await reader().collections.authors.all();

  /**
   * Combines the blog post data with the matched author data
   * - blogData.authors gives us an array of author slugs that are related to this blog post (fields.relationship)
   * - map over them to find a match in the 'author' collection and return its details
   */
  const page = {
    ...blogData,
    authors: blogData.authors.map(authorSlug =>
      authorData.find(author => author.slug === authorSlug)
    ),
  };

  const { formattedDate } = parseAndFormatPublishedDate(page.publishedOn);

  return (
    <div className="flex flex-col gap-8">
      <p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 font-medium underline hover:no-underline"
        >
          <ArrowLeftIcon />
          All blog posts
        </Link>
      </p>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl" id={H1_ID}>
          {page.title}
        </h1>

        <p className="text-sm text-slate-9">
          Published on {formattedDate} by{' '}
          {page.authors.map((author, index) => (
            <Fragment key={index}>
              {index > 0 &&
                (index === page.authors.length - 1 ? ' and ' : ', ')}

              {author?.entry.link ? (
                <a
                  href={author.entry.link}
                  className="underline hover:no-underline"
                >
                  {author.entry.name}
                </a>
              ) : (
                <>{author?.entry.name}</>
              )}
            </Fragment>
          ))}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <MarkdocRenderer node={(await page.content()).node} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await reader().collections.blog.list();

  return slugs.map(slug => ({
    slug: slug.split('/'),
  }));
}

export async function generateMetadata(
  props: BlogProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slugPath = params.slug;
  const slug = slugPath.join('/');

  const page = await reader().collections.blog.read(slug);

  const parentTitle = (await parent).title ?? 'Blog';
  const title = page?.title ?? parentTitle;

  const parentDescription = (await parent).description ?? '';
  const description = page?.summary ?? parentDescription;

  const parentTwitterSite = (await parent).twitter?.site ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keystatic.com/blog/${slug}`,
      type: 'article',
      images: [{ url: `/og/blog/${slug}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: parentTwitterSite,
    },
  };
}
