import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Button } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { fileX2Icon } from '@keystar/ui/icon/icons/fileX2Icon';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { CloudConfig, Config, GitHubConfig } from '../config';
import { CollectionPage } from './CollectionPage';
import { CreateItem } from './create-item';
import { DashboardPage } from './dashboard';
import { ItemPage } from './ItemPage';
import Provider from './provider';
import { AppShell } from './shell';
import { PageBody, PageRoot } from './shell/page';
import { EmptyState } from './shell/empty-state';
import { SingletonPage } from './SingletonPage';
import { CreatedGitHubApp } from './onboarding/created-github-app';
import { KeystaticSetup } from './onboarding/setup';
import { RepoNotFound } from './onboarding/repo-not-found';
import { AppSlugProvider } from './onboarding/install-app';
import { useRouter, RouterProvider } from './router';
import {
  isCloudConfig,
  isGitHubConfig,
  isLocalConfig,
  redirectToCloudAuth,
} from './utils';
import {
  CloudInfoProvider,
  GitHubAppShellDataContext,
  GitHubAppShellDataProvider,
} from './shell/data';
import { KeystaticCloudAuthCallback } from './cloud-auth-callback';
import { getAuth } from './auth';
import { assertValidRepoConfig } from './repo-config';
import { NotFoundBoundary, notFound } from './not-found';

type SingletonRoute = {
  kind: 'singleton';
  singleton: string;
};

type CollectionRoute =
  | { kind: 'collection'; collection: string; action: 'create' | 'list' }
  | { kind: 'collection'; collection: string; action: 'edit'; slug: string };

type DashboardRoute = { kind: 'dashboard' };

type BranchableRoute = SingletonRoute | CollectionRoute | DashboardRoute;

function parseParamsWithoutBranch(params: string[]): BranchableRoute | null {
  if (params.length === 0) {
    return { kind: 'dashboard' };
  }
  if (params.length === 2 && params[0] === 'singleton') {
    return { kind: 'singleton', singleton: params[1] };
  }
  if (params.length < 2 || params[0] !== 'collection') return null;
  const collection = params[1];
  if (params.length === 2) {
    return { kind: 'collection', collection, action: 'list' };
  }
  if (params.length === 3 && params[2] === 'create') {
    return { kind: 'collection', collection, action: 'create' };
  }
  if (params.length === 4 && params[2] === 'item') {
    const slug = params[3];
    return { kind: 'collection', collection, action: 'edit', slug };
  }
  return null;
}

type Route =
  | { kind: 'local'; inner: BranchableRoute }
  | { kind: 'branched'; branch: string; inner: BranchableRoute }
  | {
      kind: 'github-onboarding';
      step: 'setup' | 'repo-not-found' | 'created-github-app';
    };

function parseRoute(params: string[]): Route | null {
  const firstParam = params[0];
  if (firstParam === 'branch') {
    const branch = params[1];
    if (branch === undefined) {
      return null;
    }
    const parsed = parseParamsWithoutBranch(params.slice(2));
    if (parsed !== null) {
      return { kind: 'branched', branch, inner: parsed };
    }
  }
  if (
    firstParam === 'setup' ||
    firstParam === 'repo-not-found' ||
    firstParam === 'created-github-app'
  ) {
    return { kind: 'github-onboarding', step: firstParam };
  }
  const inner = parseParamsWithoutBranch(params);
  if (inner !== null) {
    return { kind: 'local', inner };
  }
  return null;
}

function RedirectToBranch(props: { config: Config }) {
  const { push } = useRouter();
  const { data, error } = useContext(GitHubAppShellDataContext)!;
  useEffect(() => {
    if (error?.response?.status === 401) {
      if (props.config.storage.kind === 'github') {
        window.location.href = '/api/keystatic/github/login';
      } else {
        redirectToCloudAuth('', props.config);
      }
    }
    if (data?.repository?.defaultBranchRef) {
      push(
        `/keystatic/branch/${encodeURIComponent(
          data.repository.defaultBranchRef.name
        )}`
      );
    }
    if (
      (props.config.storage.kind === 'github' &&
        !data?.repository?.id &&
        (error?.graphQLErrors?.[0]?.originalError as any)?.type ===
          'NOT_FOUND') ||
      (error?.graphQLErrors?.[0]?.originalError as any)?.type === 'FORBIDDEN'
    ) {
      window.location.href = '/api/keystatic/github/repo-not-found';
    }
  }, [data, error, push, props.config]);
  return null;
}

function PageInner({ config }: { config: Config }) {
  const { params } = useRouter();
  let branch = null,
    parsedParams,
    basePath: string;
  if (params.join('/') === 'cloud/oauth/callback') {
    return <KeystaticCloudAuthCallback config={config} />;
  }
  let wrapper: (element: ReactElement) => ReactElement = x => x;
  if (
    isCloudConfig(config) ||
    (isLocalConfig(config) && config.cloud?.project)
  ) {
    wrapper = element => (
      <CloudInfoProvider config={config}>{element}</CloudInfoProvider>
    );
  }
  if (isGitHubConfig(config) || isCloudConfig(config)) {
    const origWrapper = wrapper;
    wrapper = element => (
      <AuthWrapper config={config}>
        <GitHubAppShellDataProvider config={config}>
          {origWrapper(element)}
        </GitHubAppShellDataProvider>
      </AuthWrapper>
    );
    if (params.length === 0) {
      return wrapper(<RedirectToBranch config={config} />);
    }
    if (params.length === 1 && isGitHubConfig(config)) {
      if (params[0] === 'setup') return <KeystaticSetup config={config} />;
      if (params[0] === 'repo-not-found') {
        return <RepoNotFound config={config} />;
      }
      if (params[0] === 'created-github-app') {
        return <CreatedGitHubApp config={config} />;
      }
    }
    if (params[0] !== 'branch' || params.length < 2) {
      return <Text>Not found</Text>;
    }
    branch = params[1];
    basePath = `/keystatic/branch/${encodeURIComponent(branch)}`;
    parsedParams = parseParamsWithoutBranch(params.slice(2));
  } else {
    parsedParams = parseParamsWithoutBranch(params);
    basePath = '/keystatic';
  }
  return wrapper(
    <AppShell config={config} currentBranch={branch || ''} basePath={basePath}>
      <NotFoundBoundary
        fallback={
          <PageRoot>
            <PageBody>
              <EmptyState
                icon={fileX2Icon}
                title="Not found"
                message="This page could not be found."
              />
            </PageBody>
          </PageRoot>
        }
      >
        {parsedParams === null ? (
          <AlwaysNotFound />
        ) : parsedParams.kind === 'collection' ? (
          parsedParams.action === 'create' ? (
            <CreateItem
              key={parsedParams.collection}
              collection={parsedParams.collection}
            />
          ) : parsedParams.action === 'edit' ? (
            <ItemPage
              key={parsedParams.collection}
              collection={parsedParams.collection}
              itemSlug={parsedParams.slug}
            />
          ) : (
            <CollectionPage
              key={parsedParams.collection}
              collection={parsedParams.collection}
            />
          )
        ) : parsedParams.kind === 'singleton' ? (
          <SingletonPage
            key={parsedParams.singleton}
            config={config as unknown as Config}
            singleton={parsedParams.singleton}
          />
        ) : (
          <DashboardPage
            config={config as unknown as Config}
            basePath={basePath}
          />
        )}
      </NotFoundBoundary>
    </AppShell>
  );
}

function AlwaysNotFound(): never {
  notFound();
}

function AuthWrapper(props: {
  config: GitHubConfig | CloudConfig;
  children: ReactElement;
}) {
  const [state, setState] = useState<'unknown' | 'valid' | 'explicit-auth'>(
    'unknown'
  );
  const router = useRouter();
  useEffect(() => {
    getAuth(props.config).then(auth => {
      if (auth) {
        setState('valid');
        return;
      }
      setState('explicit-auth');
    });
  }, [props.config]);
  if (state === 'valid') {
    return props.children;
  }
  if (state === 'explicit-auth') {
    if (props.config.storage.kind === 'github') {
      return (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Button
            href={`/api/keystatic/github/login${
              router.params.length
                ? `?${new URLSearchParams({
                    from: router.params.map(encodeURIComponent).join('/'),
                  })}`
                : ''
            }`}
            // even though we'll never be in an iframe, so this isn't really distinct from _self
            // it makes react-aria avoid using client-side routing which we need here
            target="_top"
          >
            <Icon src={githubIcon} />
            <Text>Log in with GitHub</Text>
          </Button>
        </Flex>
      );
    }
    if (props.config.storage.kind === 'cloud') {
      return (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Button
            onPress={() => {
              redirectToCloudAuth(
                router.params.map(encodeURIComponent).join('/'),
                props.config
              );
            }}
          >
            <Text>Log in with Keystatic Cloud</Text>
          </Button>
        </Flex>
      );
    }
  }
  return null;
}

function RedirectToLoopback(props: { children: ReactNode }) {
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      window.location.href = window.location.href.replace(
        'localhost',
        '127.0.0.1'
      );
    }
  }, []);
  if (window.location.hostname === 'localhost') {
    return null;
  }
  return props.children;
}

export function Keystatic(props: {
  config: Config;
  appSlug?: { envName: string; value: string | undefined };
}) {
  if (props.config.storage.kind === 'github') {
    assertValidRepoConfig(props.config.storage.repo);
  }

  return (
    <ClientOnly>
      <RedirectToLoopback>
        <AppSlugProvider value={props.appSlug}>
          <RouterProvider>
            <Provider config={props.config}>
              <PageInner config={props.config} />
            </Provider>
          </RouterProvider>
        </AppSlugProvider>
      </RedirectToLoopback>
    </ClientOnly>
  );
}

function ClientOnly(props: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return props.children;
}
