import { VoussoirProvider } from '@voussoir/core';
import { makeLinkComponent } from '@voussoir/link';
import {
  AnchorHTMLAttributes,
  ForwardedRef,
  ReactElement,
  RefAttributes,
  useMemo,
} from 'react';
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
import { AppShellQuery } from './shell/data';
import { SSRProvider } from '@voussoir/ssr';

export default function Provider({
  children,
  repo,
  Link,
}: {
  children: JSX.Element;
  Link: (
    props: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement> &
      RefAttributes<HTMLAnchorElement>
  ) => ReactElement | null;
  repo: { owner: string; name: string } | undefined;
}) {
  const UniversalLink = useMemo(
    () =>
      makeLinkComponent(
        (
          { href, onClick, rel, ...props },
          ref: ForwardedRef<HTMLAnchorElement>
        ) => {
          const shouldUseNext = href[0] === '/';

          return shouldUseNext ? (
            <Link href={href} ref={ref} {...props} />
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
      ),
    [Link]
  );
  return (
    <SSRProvider>
      <VoussoirProvider linkComponent={UniversalLink}>
        <UrqlProvider
          value={useMemo(
            () =>
              createClient({
                url: 'https://api.github.com/graphql',
                requestPolicy: 'cache-and-network',
                exchanges: [
                  dedupExchange,
                  cacheExchange({
                    updates: {
                      Mutation: {
                        createRef(result, args, cache, _info) {
                          cache.updateQuery(
                            {
                              query: AppShellQuery,
                              variables: {
                                owner: repo!.owner,
                                name: repo!.name,
                              },
                            },
                            data => {
                              if (
                                data?.repository?.refs?.nodes &&
                                result.createRef &&
                                typeof result.createRef === 'object' &&
                                'ref' in result.createRef
                              ) {
                                return {
                                  ...data,
                                  repository: {
                                    ...data.repository,
                                    refs: {
                                      ...data.repository.refs,
                                      nodes: [
                                        ...data.repository.refs.nodes,
                                        result.createRef.ref,
                                      ],
                                    },
                                  },
                                };
                              }
                              return data;
                            }
                          );
                        },
                        deleteRef(result, args, cache, _info) {
                          cache.updateQuery(
                            {
                              query: AppShellQuery,
                              variables: {
                                owner: repo!.owner,
                                name: repo!.name,
                              },
                            },
                            data => {
                              if (
                                data?.repository?.refs?.nodes &&
                                result.deleteRef &&
                                typeof result.deleteRef === 'object' &&
                                '__typename' in result.deleteRef &&
                                typeof args.input === 'object' &&
                                args.input !== null &&
                                'refId' in args.input &&
                                typeof args.input.refId === 'string'
                              ) {
                                const refId = args.input.refId;
                                return {
                                  ...data,
                                  repository: {
                                    ...data.repository,
                                    refs: {
                                      ...data.repository.refs,
                                      nodes: data.repository.refs.nodes.filter(
                                        x => x?.id !== refId
                                      ),
                                    },
                                  },
                                };
                              }
                              return data;
                            }
                          );
                        },
                      },
                    },
                  }),
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
                    getAuth: async () => {
                      if (repo) return getAuth();
                      return null;
                    },
                  }),
                  fetchExchange,
                ],
              }),
            [repo]
          )}
        >
          {children}
        </UrqlProvider>
      </VoussoirProvider>
    </SSRProvider>
  );
}
