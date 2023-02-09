import { VoussoirProvider } from '@voussoir/core';
import { makeLinkComponent } from '@voussoir/link';
import { SSRProvider } from '@voussoir/ssr';
import NextLink from 'next/link';
import { ForwardedRef, useMemo } from 'react';
import {
  Provider as UrqlProvider,
  createClient,
  dedupExchange,
  makeOperation,
  fetchExchange,
} from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { authExchange } from '@urql/exchange-auth';
import { getAuth } from './auth';

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
    const shouldUseNext = href[0] === '/';

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

export default function Provider({ children }: { children: JSX.Element }) {
  return (
    <SSRProvider>
      <VoussoirProvider linkComponent={UniversalNextLink}>
        <UrqlProvider
          value={useMemo(
            () =>
              createClient({
                url: 'https://api.github.com/graphql',
                requestPolicy: 'cache-and-network',
                exchanges: [
                  dedupExchange,
                  cacheExchange(),
                  authExchange<{ accessToken: string }>({
                    addAuthToOperation({ operation, authState }) {
                      if (!authState) {
                        return operation;
                      }

                      const fetchOptions =
                        typeof operation.context.fetchOptions === 'function'
                          ? operation.context.fetchOptions()
                          : operation.context.fetchOptions || {};

                      return makeOperation(operation.kind, operation, {
                        ...operation.context,
                        fetchOptions: {
                          ...fetchOptions,
                          headers: {
                            ...fetchOptions.headers,
                            Authorization: `Bearer ${authState.accessToken}`,
                          },
                        },
                      });
                    },
                    getAuth,
                  }),
                  fetchExchange,
                ],
              }),
            []
          )}
        >
          {children}
        </UrqlProvider>
      </VoussoirProvider>
    </SSRProvider>
  );
}
