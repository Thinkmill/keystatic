import Link from 'next/link';
import { notFound } from 'next/navigation';
import Heading from '../../../components/heading';
import { reader } from '../../../utils/reader';
import { parseAndFormatPublishedDate } from '../../../utils';
import { ArrowRightIcon } from '../../../components/icons/arrow-right';

export default async function Blog() {
  const blogPosts = await reader.collections.blog.all();

  if (!blogPosts) notFound();

  // Sort posts by publishedOn date, and filter out draft posts
  const sortedPublishedBlogPosts = blogPosts
    .map(post => {
      const { parsedDate, formattedDate } = parseAndFormatPublishedDate(
        post.entry.publishedOn
      );

      return {
        ...post,
        parsedDate,
        formattedDate,
      };
    })
    .sort((a: { parsedDate: Date }, b: { parsedDate: Date }) =>
      a.parsedDate < b.parsedDate ? 1 : -1
    )
    .filter((post: { entry: { draft: boolean } }) => !post.entry.draft);

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl mb-6">
          Blog
        </h1>

        <p className="text-lg font-normal">
          Latest news and updates from the Keystatic team.
        </p>
      </div>

      <ol>
        {sortedPublishedBlogPosts.map(
          ({ slug, formattedDate, entry }, index) => (
            <li key={index} className="border-t border-keystatic-gray py-8">
              <p className="text-sm text-neutral-500">{formattedDate}</p>

              <div className="flex flex-col gap-4">
                <span>
                  <Link href={`blog/${slug}`}>
                    <Heading level={2}>{entry.title}</Heading>
                  </Link>
                </span>

                {entry.summary && <p>{entry.summary}</p>}

                <p>
                  <Link
                    href={`blog/${slug}`}
                    className="underline hover:no-underline font-medium inline-flex gap-1 items-center"
                  >
                    Read more{' '}
                    <span className="sr-only">about {entry.title}</span>
                    <ArrowRightIcon />
                  </Link>
                </p>
              </div>
            </li>
          )
        )}
      </ol>
    </>
  );
}
