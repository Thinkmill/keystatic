import Link from 'next/link';
import { notFound } from 'next/navigation';
import Heading from '../../../components/heading';
import { reader } from '../../../utils/reader';
import { parseAndFormatPublishedDate } from '../../../utils';
import { ArrowRightIcon } from '../../../components/icons/arrow-right';
import { H1_ID } from '../../../constants';

export default async function Blog() {
  const blogPosts = await reader().collections.blog.all();

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
      <div className="mb-8 pt-24 sm:text-center">
        <h1
          className="mb-8 text-3xl font-extrabold sm:text-4xl md:text-5xl"
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
              className="flex flex-col gap-2 border-t border-slate-4 py-8"
            >
              <p className="text-sm text-slate-9">{formattedDate}</p>

              <div className="flex flex-col gap-6">
                <Link href={`blog/${slug}`}>
                  <Heading level={2}>{entry.title}</Heading>
                </Link>

                {entry.summary && <p>{entry.summary}</p>}

                <p>
                  <Link
                    href={`blog/${slug}`}
                    className="inline-flex items-center gap-1 font-medium underline hover:no-underline"
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
