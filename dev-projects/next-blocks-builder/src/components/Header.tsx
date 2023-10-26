import { reader } from '@/keystatic/reader';
import Link from 'next/link';

export async function Header() {
  const pages = await reader.collections.pages.all();
  if (!pages) throw new Error('No pages found');
  return (
    <header className="py-16 max-w-big mx-auto px-6 border-b">
      <h1 className="text-lg font-medium">Keystatic Block Builder</h1>
      <p className="mt-4 text-slate-700 max-w-2xl">
        The "pages" entries in Keystatic will be listed below. They're assembled
        using nestable <code>componentBlocks</code>, to create a "page builder"
        experience.
      </p>
      <ul className="mt-10 flex flex-wrap gap-4">
        {pages.map(page => (
          <li
            key={page.slug}
            className="bg-slate-200 px-4 py-0.5 rounded-md text-slate-800 hover:bg-cyan-200 hover:text-cyan-900"
          >
            <Link href={page.slug}>{page.entry.title}</Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
