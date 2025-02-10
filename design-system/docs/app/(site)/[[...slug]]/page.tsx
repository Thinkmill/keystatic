import { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { DocPage } from '../../../components/doc-page';
import { transformMarkdoc } from '../../../utils/markdoc';
import { reader } from '../../../utils/packages';

export async function generateStaticParams() {
  const entries = await reader.collections.otherDocs.list();

  return entries.map(slug => {
    const split = slug.split('/');
    return {
      slug: split[split.length - 1] === 'index' ? split.slice(0, -1) : split,
    };
  });
}

export const dynamicParams = false;

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = (params.slug ?? ['index']).join('/');
  let entry = await reader.collections.otherDocs.read(slug);
  if (!entry && slug !== 'index') {
    entry = await reader.collections.otherDocs.read(slug + '/index');
  }
  if (!entry) notFound();
  return { title: entry.title };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const slug = ((await props.params).slug ?? ['index']).join('/');
  let entry = await reader.collections.otherDocs.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!entry && slug !== 'index') {
    entry = await reader.collections.otherDocs.read(slug + '/index', {
      resolveLinkedFiles: true,
    });
  }
  if (!entry) notFound();

  const content = transformMarkdoc(slug, entry?.content.node);

  return (
    <DocPage
      content={content}
      title={entry.title}
      description={entry.description}
    />
  );
}
