import { reader } from './reader';

export default async function Thing() {
  return (
    <pre>
      {JSON.stringify(
        await reader.collections.posts.all({ resolveLinkedFiles: true }),
        null,
        2
      )}
    </pre>
  );
}
