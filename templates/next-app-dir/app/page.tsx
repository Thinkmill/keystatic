import { reader } from './reader';

export default async function Homepage() {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {(await reader.collections.posts.all()).map(post => (
          <li>
            <a href={`/${post.slug}`}>{post.entry.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
