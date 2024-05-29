import React from 'react';
import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Markdoc from '@markdoc/markdoc';

import { reader } from '../reader.server';
import { markdocConfig } from '../../keystatic.config';

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) throw json('Not Found', { status: 404 });
  const post = await reader.collections.posts.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!post) throw json('Not Found', { status: 404 });
  const errors = Markdoc.validate(post.content.node, markdocConfig);
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }
  const content = Markdoc.transform(post.content.node, markdocConfig);
  return json({
    post: {
      title: post.title,
      content,
    },
  });
}

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();
  return (
    <div className="content">
      <h1>{post.title}</h1>
      {Markdoc.renderers.react(post.content, React)}
    </div>
  );
}
