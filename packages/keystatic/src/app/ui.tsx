import {
  AnchorHTMLAttributes,
  ReactElement,
  ReactNode,
  RefAttributes,
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
import { AppShell, AppShellBody, AppShellRoot, EmptyState } from './shell';
import { SingletonPage } from './SingletonPage';
import { FromTemplateDeploy } from './onboarding/from-template-deploy';
import { CreatedGitHubApp } from './onboarding/created-github-app';
import { KeystaticSetup } from './onboarding/setup';
import { RepoNotFound } from './onboarding/repo-not-found';
import { AppSlugProvider } from './onboarding/install-app';
import { useRouter, Router, RouterProvider } from './router';
import { isCloudConfig, isGitHubConfig, redirectToCloudAuth } from './utils';
import {
  GitHubAppShellDataContext,
  GitHubAppShellDataProvider,
} from './shell/data';
import { KeystaticCloudAuthCallback } from './cloud-auth-callback';
import { getAuth } from './auth';
import { assertValidRepoConfig } from './repo-config';
import { NotFoundBoundary, notFound } from './not-found';

function parseParamsWithoutBranch(params: string[]) {
  if (params.length === 0) {
    return {};
  }
  if (params.length === 2 && params[0] === 'singleton') {
    return { singleton: params[1] };
  }
  if (params.length < 2 || params[0] !== 'collection') return null;
  const collection = params[1];
  if (params.length === 2) {
    return { collection };
  }
  if (params.length === 3 && params[2] === 'create') {
    return { collection, kind: 'create' as const };
  }
  if (params.length === 4 && params[2] === 'item') {
    const slug = params[3];
    return { collection, kind: 'edit' as const, slug };
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
  if (
    config.storage.kind === 'cloud' &&
    params.join('/') === 'cloud/oauth/callback'
  ) {
    return <KeystaticCloudAuthCallback config={config} />;
  }
  let wrapper: (element: ReactElement) => ReactElement = x => x;
  if (isGitHubConfig(config) || isCloudConfig(config)) {
    wrapper = element => (
      <AuthWrapper config={config}>
        <GitHubAppShellDataProvider config={config}>
          {element}
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
      if (params[0] === 'from-template-deploy') {
        return <FromTemplateDeploy config={config} />;
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
          <AppShellRoot>
            <AppShellBody>
              <EmptyState
                icon={fileX2Icon}
                title="Not found"
                message="This page could not be found."
              />
            </AppShellBody>
          </AppShellRoot>
        }
      >
        {parsedParams === null ? (
          <AlwaysNotFound />
        ) : parsedParams.collection ? (
          parsedParams.kind === 'create' ? (
            <CreateItem
              key={parsedParams.collection}
              collection={parsedParams.collection}
              config={config}
              basePath={basePath}
            />
          ) : parsedParams.kind === 'edit' ? (
            <ItemPage
              key={parsedParams.collection}
              collection={parsedParams.collection}
              basePath={basePath}
              config={config}
              itemSlug={parsedParams.slug}
            />
          ) : (
            <CollectionPage
              key={parsedParams.collection}
              basePath={basePath}
              collection={parsedParams.collection}
              config={config as unknown as Config}
            />
          )
        ) : parsedParams.singleton ? (
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
                ? `?${new URLSearchParams({ from: router.params.join('/') })}`
                : ''
            }`}
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
              redirectToCloudAuth(router.params.join('/'), props.config);
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

export function Keystatic(props: {
  config: Config;
  router: Router;
  link: (
    props: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement> &
      RefAttributes<HTMLAnchorElement>
  ) => ReactNode;
  appSlug?: { envName: string; value: string | undefined };
}) {
  if (props.config.storage.kind === 'github') {
    assertValidRepoConfig(props.config.storage.repo);
  }
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
  return (
    <AppSlugProvider value={props.appSlug}>
      <RouterProvider router={props.router}>
        <Provider config={props.config} Link={props.link}>
          <PageInner config={props.config} />
        </Provider>
      </RouterProvider>
    </AppSlugProvider>
  );
}
