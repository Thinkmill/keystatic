import { reader } from '../../keystatic/reader';

export default async function Homepage() {
  const pages = await reader.collections.pages.all();
  if (!pages) throw new Error('No pages found');
  return (
    <main className="mt-16 max-w-big mx-auto px-6">
      <p>Select one of the demos above! 👆</p>
    </main>
  );
}
