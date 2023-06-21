import Link from 'next/link';
import { notFound } from 'next/navigation';
import { parse, format } from 'date-fns';
import Heading from '../../../components/heading';
import { reader } from '../../../utils/reader';

export default async function Blog() {
  const blogPosts = await reader.collections.blog.all();

  if (!blogPosts) notFound();

  // Filter out posts with draft: true
  const publishedBlogPosts = blogPosts.filter(
    (post: { entry: { draft: boolean } }) => !post.entry.draft
  );

  // Sort posts by publishedOn date
  const sortedBlogPosts = publishedBlogPosts
    .map(post => {
      const today = new Date();
      const publishedDate = post.entry.publishedOn;
      const parsedDate = parse(publishedDate, 'yyyy-M-d', today); // whatever your format is
      const formattedDate = format(parsedDate, 'MMMM do, yyyy'); // however you need to display on the page (not for sorting, only display)

      return {
        ...post,
        parsedDate,
        formattedDate,
      };
    })
    .sort((a: { parsedDate: Date }, b: { parsedDate: Date }) =>
      a.parsedDate < b.parsedDate ? 1 : -1
    );

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
        {sortedBlogPosts.map(({ slug, formattedDate, entry }, index) => (
          <li key={index} className="border-t border-keystatic-gray py-8">
            <p className="text-sm text-keystatic-gray-dark">{formattedDate}</p>

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
                  Read more <span className="sr-only">about {entry.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
