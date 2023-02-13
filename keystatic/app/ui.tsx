import { gql } from '@ts-gql/tag/no-transform';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'urql';

import { injectVoussoirStyles } from '@voussoir/core';
import { Notice } from '@voussoir/notice';

import { Config, GitHubConfig } from '../config';
import { CollectionPage } from './CollectionPage';
import { CreateItem } from './create-item';
import { DashboardPage } from './dashboard';
import { ItemPage } from './ItemPage';
import Provider from './provider';
import { AppShell, AppShellBody, AppShellRoot } from './shell';
import { SingletonPage } from './SingletonPage';
import { FromTemplateDeploy } from './onboarding/from-template-deploy';
import { CreatedGitHubApp } from './onboarding/created-github-app';
import { KeystaticSetup } from './onboarding/setup';
import { RepoNotFound } from './onboarding/repo-not-found';
import { isGitHubConfig } from './utils';

injectVoussoirStyles('surface');

function parseParams(params: string[]) {
  if (params.length < 2 || params[0] !== 'branch') return null;
  const branch = params[1];
  if (params.length === 2) {
    return { branch };
  }
  if (params.length === 4 && params[2] === 'singleton') {
    return { branch, singleton: params[3] };
  }
  if (params.length < 4 || params[2] !== 'collection') return null;
  const collection = params[3];
  if (params.length === 4) {
    return { branch, collection };
  }
  if (params.length === 5 && params[4] === 'create') {
    return { branch, collection, kind: 'create' as const };
  }
  if (params.length === 6 && params[4] === 'item') {
    const slug = params[5];
    return { branch, collection, kind: 'edit' as const, slug };
  }
  return null;
}

function RedirectToBranch(props: { config: GitHubConfig }) {
  const { push } = useRouter();
  const [{ data, error }] = useQuery({
    query: gql`
      query DefaultBranch($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
          defaultBranchRef {
            id
            name
          }
        }
      }
    ` as import('../__generated__/ts-gql/DefaultBranch').type,
    variables: { name: props.config.storage.repo.name, owner: props.config.storage.repo.owner },
  });
  useEffect(() => {
    if (error?.response.status === 401) {
      window.location.href = '/api/keystatic/github/login';
    }
    if (data?.repository?.defaultBranchRef) {
      push(`/keystatic/branch/${data.repository.defaultBranchRef.name}`);
    }
    if (
      !data?.repository?.id &&
      (error?.graphQLErrors?.[0]?.originalError as any)?.type === 'NOT_FOUND'
    ) {
      push('/keystatic/repo-not-found');
    }
  }, [data, error, push]);
  return null;
}

export function makePage<Collections extends { [key: string]: any }>(config: Config<Collections>) {
  function PageInner() {
    const router = useRouter();
    if (!router.isReady) return null;
    const params = (router.query.rest ?? []) as string[];
    if (isGitHubConfig(config)) {
      if (params.length === 0) {
        return <RedirectToBranch config={config} />;
      }
      if (params.length === 1) {
        if (params[0] === 'setup') return <KeystaticSetup config={config} />;
        if (params[0] === 'repo-not-found') return <RepoNotFound config={config} />;
        if (params[0] === 'from-template-deploy') return <FromTemplateDeploy config={config} />;
        if (params[0] === 'created-github-app') return <CreatedGitHubApp config={config} />;
      }
    }
    const parsedParams = parseParams(params);
    if (!parsedParams) return null;
    return (
      <AppShell config={config} currentBranch={parsedParams.branch}>
        {parsedParams?.collection ? (
          parsedParams.collection in (config.collections || {}) ? (
            parsedParams.kind === 'create' ? (
              <CreateItem
                collection={parsedParams.collection}
                config={config}
                currentBranch={parsedParams.branch}
              />
            ) : parsedParams.kind === 'edit' ? (
              <ItemPage
                collection={parsedParams.collection}
                currentBranch={parsedParams.branch}
                config={config}
                itemSlug={parsedParams.slug}
              />
            ) : (
              <CollectionPage
                branch={parsedParams.branch}
                collection={parsedParams.collection}
                config={config as unknown as Config}
              />
            )
          ) : (
            <AppShellRoot>
              <AppShellBody>
                <Notice tone="critical">Collection "{parsedParams.collection}" not found.</Notice>
              </AppShellBody>
            </AppShellRoot>
          )
        ) : parsedParams.singleton ? (
          parsedParams.singleton in (config.singletons || {}) ? (
            <SingletonPage
              config={config as unknown as Config}
              currentBranch={parsedParams.branch}
              singleton={parsedParams.singleton}
            />
          ) : (
            <AppShellRoot>
              <AppShellBody>
                <Notice tone="critical">Singleton "{parsedParams.singleton}" not found</Notice>
              </AppShellBody>
            </AppShellRoot>
          )
        ) : (
          <DashboardPage config={config as unknown as Config} currentBranch={parsedParams.branch} />
        )}
      </AppShell>
    );
  }
  return function Page() {
    return (
      <Provider>
        <PageInner />
      </Provider>
    );
  };
}
