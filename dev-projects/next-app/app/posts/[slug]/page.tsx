import { notFound } from 'next/navigation';
import { createReader } from '@keystatic/core/reader';
import { DocumentRenderer } from '@keystatic/core/renderer';
import localConfig from '../../../keystatic.config';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const reader = createReader(process.cwd(), localConfig);
  const slugs = await reader.collections.posts.list();
  return slugs.map(slug => ({ slug }));
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const reader = createReader(process.cwd(), localConfig);
  const { slug } = await props.params;
  const post = await reader.collections.posts.read(slug);
  if (!post) notFound();

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: 12 }}>{post.title}</h1>
      <div style={{ lineHeight: 1.75 }}>
        <DocumentRenderer document={await post.content()} />
      </div>
    </main>
  );
}
