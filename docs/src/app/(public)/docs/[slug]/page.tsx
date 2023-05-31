import { createReader } from '@keystatic/core/reader';
import { TableOfContents } from '../../../../components/navigation/table-of-contents';
import DocumentRenderer from '../../../../components/document-renderer';
import keystaticConfig from '../../../../../keystatic.config';

const reader = createReader('', keystaticConfig);

export default async function Docs({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const page = await reader.collections.pages.read(slug);

  if (!page) return <div>Page not found</div>;

  // Filter headings from the document content
  const headings = (await page.content())
    .filter(child => child.type === 'heading')
    .map(heading => ({
      level: heading.level as number,
      text: heading.children.find(child => child.text)?.text as string,
    }))
    .filter(heading => heading.text);

  return (
    <div className="grid gap-6 grid-cols-[auto] md:grid-cols-[auto,12rem]">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl mb-6">
          {page.title}
        </h1>
        <div className="flex flex-col gap-4">
          {/* @ts-expect-error Server Component */}
          <DocumentRenderer slug={slug} document={await page.content()} />
        </div>
      </div>
      <TableOfContents headings={headings} />
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await reader.collections.pages.list();

  return slugs.map(slug => ({
    slug,
  }));
}
