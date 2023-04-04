// this page mainly exists to make sure @keystatic/core/reader from server components
import { createReader } from '@keystatic/core/reader';
import localConfig from '../../local-config';

export default async function Page() {
  const reader = createReader('../packages/keystatic/test-data', localConfig);
  const slugs = await reader.collections.posts.list();
  return (
    <div>
      <ul>
        {slugs.map(slug => (
          <li key={slug}>{slug}</li>
        ))}
      </ul>
      {await Promise.all(
        slugs.map(async slug => {
          const item = await reader.collections.posts.read(slug);
          if (!item) return null;
          return (
            <div key={slug}>
              <pre>
                {JSON.stringify(
                  {
                    title: item.title,
                    authors: item.authors.map(x => x.name),
                    content: await item.content(),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          );
        })
      )}
    </div>
  );
}
