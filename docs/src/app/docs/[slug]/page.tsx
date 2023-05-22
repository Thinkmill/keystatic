import { createReader } from '@keystatic/core/reader';
import DocumentRenderer from '../../../components/document-renderer';
import keystaticConfig from '../../../../keystatic.config';
import { TableOfContents } from '../../../components/navigation/toc';

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
    <>
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl mb-4">{page.title}</h1>
        <div>
          {/* @ts-expect-error Server Component */}
          <DocumentRenderer slug={slug} document={await page.content()} />
        </div>
      </div>
      <TableOfContents headings={headings} />
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await reader.collections.pages.list();

  return slugs.map(slug => ({
    slug,
  }));
}
