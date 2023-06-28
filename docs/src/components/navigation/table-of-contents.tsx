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
  // TODO make fixed instead of position sticky
  // TODO fix identical headings so they get a unique slug?
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

  const { activeHeadingSlug } = useHeadingObserver(slugs);

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
                `#${activeHeadingSlug}` === slug
                  ? 'font-medium text-neutral-700'
                  : 'text-neutral-600'
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
  const observerTop = useRef<IntersectionObserver>();
  const observerBottom = useRef<IntersectionObserver>();
  const [activeHeadingSlug, setActiveHeadingSlug] = useState('overview');
  const [bottomHeadingSlug, setBottomHeadingSlug] = useState('');

  console.log({ activeHeadingSlug });
  console.log({ bottomHeadingSlug });

  const selectors = slugs.join(', ');

  useEffect(() => {
    const handleObserverTop = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry?.isIntersecting) {
          setActiveHeadingSlug(entry.target.id);
        }
      });
    };

    observerTop.current = new IntersectionObserver(handleObserverTop, {
      rootMargin: '-100px 0px -50% 0px',
      threshold: 1,
    });

    if (!selectors) return;

    const elements = document.querySelectorAll(selectors);

    elements.forEach(element => {
      observerTop.current?.observe(element);
    });

    return () => {
      observerTop.current?.disconnect();
    };
  }, [selectors]);

  useEffect(() => {
    const handleObserverBottom = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry?.isIntersecting) {
          setBottomHeadingSlug(entry.target.id);
        }
      });
    };

    observerBottom.current = new IntersectionObserver(handleObserverBottom, {
      rootMargin: '-50% 0px 0px 0px',
      threshold: 1,
    });

    if (!selectors) return;

    const elements = document.querySelectorAll(selectors);

    elements.forEach(element => {
      observerBottom.current?.observe(element);
    });

    return () => {
      observerBottom.current?.disconnect();
    };
  }, [selectors]);

  return { activeHeadingSlug };
}
