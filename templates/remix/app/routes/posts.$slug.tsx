import { DocumentRenderer } from '@keystatic/core/renderer';
import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { reader } from '../reader.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) throw json('Not Found', { status: 404 });
  const post = await reader.collections.posts.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!post) throw json('Not Found', { status: 404 });
  return json({ post });
}

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{post.title}</h1>
      <div>
        <DocumentRenderer document={post.content} />
      </div>
    </div>
  );
}
