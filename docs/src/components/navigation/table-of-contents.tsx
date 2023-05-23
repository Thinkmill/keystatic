import slugify from '@sindresorhus/slugify';

type Heading = {
  level: number;
  text: string;
};

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <div className="w-[12rem] sticky top-10 lg:top-32 self-start hidden md:block">
      <h2 className="text-xs uppercase text-stone-500">On this page</h2>

      <ul className="mt-2 flex flex-col gap-3">
        {headings.map(({ level, text }) => (
          <li>
            <a
              className={`block text-sm text-stone-600 leading-tight hover:underline ${
                level > 2 ? 'pl-2' : ''
              }`}
              href={`#${slugify(text)}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
