import { notFound } from 'next/navigation';
import { reader } from '@/keystatic/reader';
import { DocumentRenderer as PageBuilder } from '@keystatic/core/renderer';

import { Heading } from '@/components/keystatic-renderer/Heading';
import { Testimonial } from '@/components/keystatic-renderer/Testimonial';
import { Container } from '@/components/keystatic-renderer/Container';
import { TwoColumns } from '@/components/keystatic-renderer/TwoColumns';
// import { SimpleText } from '@/components/keystatic-renderer/SimpleText';

export default async function Page({ params }: { params: { page: string[] } }) {
  const pageSlug = params.page ? params.page.join('/') : 'homepage';
  const page = await reader.collections.pages.read(pageSlug, {
    resolveLinkedFiles: true,
  });
  if (!page) notFound();
  return (
    <main>
      <h1 className="text-xl font-medium">Keystatic page builder test</h1>
      <div className="py-12">
        <PageBuilder
          document={page.content}
          renderers={{
            block: {
              heading: props => <Heading {...props} />,
            },
          }}
          componentBlocks={{
            section: props => <Container {...props} />,
            testimonial: props => <Testimonial {...props} />,
            twoColumns: props => <TwoColumns {...props} />,
            // simpleText: props => <SimpleText {...props} />,
          }}
        />
      </div>
      <div className="p-8">
        <details>
          <summary>Show page data</summary>
          <pre className="bg-slate-100 text-sm mt-4 rounded p-4">
            {JSON.stringify(page, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}
