import { type MetaFunction, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { reader } from '../reader.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix + Keystatic!' },
  ];
};

export async function loader() {
  const posts = await reader.collections.posts.all();
  return json({ posts });
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="content">
      <h1>Keystatic ⚡️</h1>
      <p>This homepage shows how to load a collection from the reader API.</p>
      <p>
        <Link to="/keystatic">Click here to visit the Admin UI</Link>, or the
        link below to view a post in the collection.
      </p>

      <h2>Posts</h2>
      {posts.length ? (
        <ul>
          {posts.map(post => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>{post.entry.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          There are currently no posts. Go{' '}
          <Link to="/keystatic/collection/posts/create">
            create one in Keystatic
          </Link>
          !
        </p>
      )}
    </div>
  );
}
