import Link from 'next/link';
import { notFound } from 'next/navigation';
import Heading from '../../../components/heading';
import { reader } from '../../../utils/reader';
import { parseAndFormatPublishedDate } from '../../../utils';
import { ArrowRightIcon } from '../../../components/icons/arrow-right';
import { H1_ID } from '../../../constants';

export default async function Blog() {
  const blogPosts = await reader.collections.blog.all();

  if (!blogPosts) notFound();

  // Filter out draft posts, and sort posts by publishedOn date
  const publishedSortedBlogPosts = blogPosts
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
    .filter(post => !post.entry.draft)
    .sort((a, b) => (a.parsedDate < b.parsedDate ? 1 : -1));

  return (
    <>
      <div className="sm:text-center mb-8">
        <h1
          className="font-extrabold text-3xl sm:text-4xl md:text-5xl mb-8"
          id={H1_ID}
        >
          Blog
        </h1>

        <p className="text-lg font-normal">
          Latest news and updates from the Keystatic team.
        </p>
      </div>

      <ol>
        {publishedSortedBlogPosts.map(
          ({ slug, formattedDate, entry }, index) => (
            <li
              key={index}
              className="border-t border-keystatic-gray py-8 flex flex-col gap-2"
            >
              <p className="text-sm text-neutral-500">{formattedDate}</p>

              <div className="flex flex-col gap-6">
                <Link href={`blog/${slug}`}>
                  <Heading level={2}>{entry.title}</Heading>
                </Link>

                {entry.summary && <p>{entry.summary}</p>}

                <p>
                  <Link
                    href={`blog/${slug}`}
                    className="underline hover:no-underline font-medium inline-flex gap-1 items-center"
                    tabIndex={-1}
                    aria-hidden
                  >
                    Read more
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
