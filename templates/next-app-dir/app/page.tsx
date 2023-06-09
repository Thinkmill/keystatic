import { Styles } from './styles';
import { reader } from './reader';

export default async function Homepage() {
  const posts = await reader.collections.posts.all();

  return (
    <div>
      <h1>Keystatic ⚡️</h1>
      <p>
        This page is an example of loading a collection of data from the reader
        API.
      </p>
      <p>
        Click the link below to see an example of loading a specific item from
        the collection, or{' '}
        <a href="/keystatic">click here to visit the Admin UI.</a>
      </p>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li>
            <a href={`/${post.slug}`}>{post.entry.title}</a>
          </li>
        ))}
      </ul>

      <Styles />
    </div>
  );
}
