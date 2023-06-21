import DocumentRenderer from '../../../../components/document-renderer';
import { notFound } from 'next/navigation';
import { reader } from '../../../../utils/reader';
import Link from 'next/link';
import { format, parse } from 'date-fns';

export default async function BlogPost({
  params,
}: {
  params: { slug: string[] };
}) {
  const { slug: slugPath } = params;

  const slug = slugPath.join('/');
  const page = await reader.collections.blog.read(slug);

  if (!page) notFound();

  const today = new Date();
  const publishedDate = page.publishedOn;
  const parsedDate = parse(publishedDate, 'yyyy-M-d', today);
  const formattedDate = format(parsedDate, 'MMMM do, yyyy');

  return (
    <>
      <p>
        <Link
          href="/blog"
          className="underline hover:no-underline font-medium inline-flex gap-1 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          All blog posts
        </Link>
      </p>

      <h1 className="text-2xl font-extrabold sm:text-3xl">{page.title}</h1>

      <p className="text-sm mb-4 text-keystatic-gray-dark">
        Published on {formattedDate} by TODO
      </p>

      <div className="flex flex-col gap-4">
        <DocumentRenderer slug={slug} document={await page.content()} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await reader.collections.blog.list();

  return slugs.map(slug => ({
    slug: slug.split('/'),
  }));
}
