import NextLink from 'next/link';
import { ForwardedRef } from 'react';

import { makeLinkComponent } from '@voussoir/link';

/**
 * Resolves internal links using the
 * [Next.js Link component](https://nextjs.org/docs/api-reference/next/link), which
 * expects "href" to begin with a slash e.g. `href="/page"`. Uses a traditional
 * anchor element for everything else e.g. external, hash, tel, mailto.
 *
 * For compatibility with TS + Voussoir the "href" property may only accept a
 * string, so URL Objects must be resolved ahead of time. We recommend the [url
 * package](https://www.npmjs.com/package/url) for complex cases, though most of
 * the time it's simple to do this manually.
 */
export const UniversalNextLink = makeLinkComponent(
  ({ href, onClick, rel, ...props }, ref: ForwardedRef<HTMLAnchorElement>) => {
    const shouldUseNext = href[0] === '/' && href[1] !== '/';

    return shouldUseNext ? (
      <NextLink href={href} ref={ref} {...props} />
    ) : (
      <a
        ref={ref}
        href={href}
        rel={rel || 'noreferrer noopener'}
        onClick={event => {
          if (href === '' || href === '#') {
            event.preventDefault();
          }

          if (typeof onClick === 'function') {
            onClick(event);
          }
        }}
        {...props}
      />
    );
  }
);
