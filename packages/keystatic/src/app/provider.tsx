import {
  ClientSideOnlyDocumentElement,
  VoussoirProvider,
} from '@voussoir/core';
import { makeLinkComponent } from '@voussoir/link';
import { Toaster } from '@voussoir/toast';
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
  fetchExchange,
  Client,
} from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { authExchange } from '@urql/exchange-auth';
import { getAuth, getSyncAuth } from './auth';
import { CloudAppShellQuery, GitHubAppShellQuery } from './shell/data';
import { persistedExchange } from '@urql/exchange-persisted';
import {
  KEYSTATIC_CLOUD_API_URL,
  KEYSTATIC_CLOUD_HEADERS,
  redirectToCloudAuth,
} from './utils';
import { Config } from '../config';

export function createUrqlClient(config: Config): Client {
  const repo = {
    owner:
      config.storage.kind === 'github'
        ? config.storage.repo.owner
        : 'repo-owner',
    name:
      config.storage.kind === 'github'
        ? config.storage.repo.owner
        : 'repo-name',
  };
  return createClient({
    url:
      config.storage.kind === 'github'
        ? 'https://api.github.com/graphql'
        : `${KEYSTATIC_CLOUD_API_URL}/v1/github/graphql`,
    requestPolicy: 'cache-and-network',
    exchanges: [
      dedupExchange,
      authExchange(async utils => {
        let authState = await getAuth(config);
        return {
          addAuthToOperation(operation) {
            authState = getSyncAuth(config);
            if (!authState) {
              return operation;
            }
            return utils.appendHeaders(operation, {
              Authorization: `Bearer ${authState.accessToken}`,
              ...(config.storage.kind === 'cloud'
                ? KEYSTATIC_CLOUD_HEADERS
                : {}),
            });
          },
          didAuthError() {
            return false;
          },
          willAuthError(operation) {
            authState = getSyncAuth(config);
            if (
              operation.query.definitions[0].kind === 'OperationDefinition' &&
              operation.query.definitions[0].name?.value.includes('AppShell') &&
              !authState
            ) {
              if (config.storage.kind === 'github') {
                window.location.href = '/api/keystatic/github/login';
              } else {
                redirectToCloudAuth('', config);
              }
              return true;
            }
            if (!authState) {
              return true;
            }
            return false;
          },
          async refreshAuth() {
            authState = await getAuth(config);
          },
        };
      }),
      cacheExchange({
        updates: {
          Mutation: {
            createRef(result, args, cache, _info) {
              cache.updateQuery(
                {
                  query:
                    config.storage.kind === 'github'
                      ? GitHubAppShellQuery
                      : CloudAppShellQuery,
                  variables: repo,
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
                  query:
                    config.storage.kind === 'github'
                      ? GitHubAppShellQuery
                      : CloudAppShellQuery,
                  variables: repo,
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
      ...(config.storage.kind === 'github'
        ? []
        : [
            persistedExchange({
              enableForMutation: true,
              enforcePersistedQueries: true,
            }),
          ]),
      fetchExchange,
    ],
  });
}

export default function Provider({
  children,
  Link,
  config,
}: {
  children: JSX.Element;
  Link: (
    props: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement> &
      RefAttributes<HTMLAnchorElement>
  ) => ReactElement | null;
  config: Config;
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
    <VoussoirProvider linkComponent={UniversalLink}>
      <ClientSideOnlyDocumentElement bodyBackground="surface" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <UrqlProvider value={useMemo(() => createUrqlClient(config), [config])}>
        {children}
      </UrqlProvider>
      <Toaster />
    </VoussoirProvider>
  );
}
