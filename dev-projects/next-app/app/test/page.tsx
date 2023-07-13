// this page mainly exists to make sure @keystatic/core/reader from server components
import { createReader } from '@keystatic/core/reader';
import localConfig from '../../keystatic.config';

function time() {
  const start = performance.now();
  return () => {
    const end = performance.now();
    return end - start;
  };
}

export default async function Page() {
  const reader = createReader('../packages/keystatic/test-data', localConfig);
  const endFirst = time();
  const entries = await reader.collections.posts.all();
  const firstTime = endFirst();
  const endSecond = time();
  await reader.collections.posts.all();
  const secondTime = endSecond();
  return (
    <div>
      <div>
        <p>first: {firstTime}</p>
        <p>second: {secondTime}</p>
      </div>
      <pre>{JSON.stringify(entries, null, 2)}</pre>
    </div>
  );
}
