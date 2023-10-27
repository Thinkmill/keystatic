import { notFound } from 'next/navigation';
import { DocumentRenderer as PageBuilder } from '@keystatic/core/renderer';

import { reader } from '../../../keystatic/reader';

import { Heading } from '../../../components/keystatic-renderer/Heading';
import { Testimonial } from '../../../components/keystatic-renderer/Testimonial';
import { CallToAction } from '../../../components/keystatic-renderer/CallToAction';
import { Container } from '../../../components/keystatic-renderer/Container';
import { TwoColumns } from '../../../components/keystatic-renderer/TwoColumns';
import { DataDump } from '../../../components/DataDump';
// import { SimpleText } from '../../../components/keystatic-renderer/SimpleText';

export async function generateStaticParams() {
  const pages = await reader.collections.pages.list();
  return pages.map(page => ({ page: page.split('/') }));
}

export default async function Page({ params }: { params: { page: string[] } }) {
  const pageSlug = params.page ? params.page.join('/') : 'homepage';
  const page = await reader.collections.pages.read(pageSlug, {
    resolveLinkedFiles: true,
  });
  if (!page) notFound();
  return (
    <>
      <main>
        <div className="max-w-big mx-auto py-12">
          <h1 className="px-6 text-2xl lg:text-4xl font-extrabold">
            {page.title}
          </h1>
        </div>
        <div className="prose max-w-big mx-auto px-6">
          <PageBuilder
            document={page.content}
            renderers={{
              block: {
                heading: props => <Heading {...props} />,
                paragraph: props => <p className="first:mt-0" {...props} />,
              },
            }}
            componentBlocks={{
              section: props => <Container {...props} />,
              testimonial: props => <Testimonial {...props} />,
              twoColumns: props => <TwoColumns {...props} />,
              callToAction: props => <CallToAction {...props} />,
              // simpleText: props => <SimpleText {...props} />,
            }}
          />
        </div>
      </main>
      <footer>
        <DataDump data={page} />
      </footer>
    </>
  );
}
