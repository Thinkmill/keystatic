'use client';

import slugify from '@sindresorhus/slugify';
import { useEffect, useRef, useState } from 'react';

type Heading = {
  level: number;
  text: string;
};

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const headingsWithSlugs = headings.map(({ level, text }) => {
    return {
      level,
      text,
      slug: `#${slugify(text)}`,
    };
  });

  const slugs = headingsWithSlugs.map(({ slug }) => {
    return slug;
  });

  const { activeHeading } = useHeadingObserver(slugs);

  return (
    <div className="w-[12rem] sticky top-10 lg:top-32 self-start hidden md:block">
      <h2 className="text-xs uppercase text-neutral-500">On this page</h2>

      <ul className="mt-4 flex flex-col gap-3">
        {headingsWithSlugs.map(({ level, text, slug }) => (
          <li key={text}>
            <a
              className={`block text-sm leading-tight hover:underline ${
                level > 2 ? 'pl-2 text-xs' : ''
              } ${
                `#${activeHeading}` === slug
                  ? 'text-keystatic-gray-dark'
                  : 'text-neutral-500'
              }`}
              href={slug}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useHeadingObserver(slugs: string[]) {
  const observer = useRef<IntersectionObserver>();
  const [activeHeading, setActiveHeading] = useState('heading-1-overview');
  const [visibleHeadings, setVisibleHeadings] = useState<string[]>([]);

  const selectors = slugs.join(', ');

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry?.isIntersecting) {
          // Add entry.target.id to the state array
          setVisibleHeadings(prevState => [...prevState, entry.target.id]);
        } else {
          // Remove entry.target.id from the state array
          setVisibleHeadings(prevState =>
            prevState.filter(id => id !== entry.target.id)
          );
        }
      });
    };

    if (!selectors) return;

    const elements = document.querySelectorAll(selectors);

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '-100px 0px -25% 0px',
      threshold: 1,
    });

    elements.forEach(element => {
      observer.current?.observe(element);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [selectors]);

  /**
   * Rearrange visible headings based on incoming slugs' order,
   * and return the first one as the activeHeading.
   */
  useEffect(() => {
    const sortedVisibleHeadings = visibleHeadings.sort((a, b) => {
      const aIndex = slugs.findIndex(slug => slug === `#${a}`);
      const bIndex = slugs.findIndex(slug => slug === `#${b}`);

      if (aIndex === -1) {
        return bIndex === -1 ? 0 : 1; // Keep b if a not found
      } else if (bIndex === -1) {
        return -1; // Move a before b if b not found
      }

      return aIndex - bIndex; // Sort based on index difference
    });

    if (sortedVisibleHeadings[0]) {
      // Set the first ordered visible heading as the active one
      setActiveHeading(sortedVisibleHeadings[0]);
    }
  }, [slugs, visibleHeadings]);

  return { activeHeading };
}
