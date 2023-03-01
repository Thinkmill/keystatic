import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { ButtonGroup, Button } from '@voussoir/button';
import { Dialog } from '@voussoir/dialog';
import { ProgressCircle } from '@voussoir/progress';
import { Content } from '@voussoir/slots';
import { TextField } from '@voussoir/text-field';
import { Heading, Text } from '@voussoir/typography';
import { useCallback, useContext, useEffect, useId, useState } from 'react';
import l10nMessages from './l10n/index.json';
import { GitHubConfig } from '../config';
import { getAuth } from './auth';
import { useClient } from 'urql';
import { gql } from '@ts-gql/tag/no-transform';
import { ViewerContext } from './shell/sidebar';
import { AppShellQuery } from './shell/data';
import { useData } from './useData';
import { Notice } from '@voussoir/notice';
import { AppSlugContext } from './onboarding/install-app';
import { Flex } from '@voussoir/layout';

export function ForkRepoDialog(props: {
  onDismiss: () => void;
  onCreate: () => void;
  config: GitHubConfig;
}) {
  const viewer = useContext(ViewerContext);
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  const [installationsRefetchKey, setInstallationsRefetchKey] = useState(0);

  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (
        event.key === 'ks-refetch-installations' &&
        event.newValue === 'true'
      ) {
        setInstallationsRefetchKey(x => x + 1);
        localStorage.removeItem('ks-refetch-installations');
      }
    };
    addEventListener('storage', listener);
    return () => removeEventListener('storage', listener);
  }, []);

  const hasInstallationData = useData(
    useCallback(async () => {
      const auth = await getAuth();
      if (!auth) throw new Error('Unauthorized');
      const res = await fetch('https://api.github.com/user/installations', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      return (json.installations as any[]).some(
        x => x.account.login === viewer?.login
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [installationsRefetchKey, viewer?.login])
  );
  const appSlug = useContext(AppSlugContext);

  return (
    <Dialog size="small">
      <Heading>Fork Repo</Heading>
      {hasInstallationData.kind === 'loading' ? (
        <Content>
          <Flex justifyContent="center">
            <ProgressCircle
              isIndeterminate
              aria-label="Loading GitHub App Installations"
            />
          </Flex>
        </Content>
      ) : hasInstallationData.kind === 'error' ? (
        <>
          <Content>
            <Notice tone="critical">{hasInstallationData.error.message}</Notice>
          </Content>
          <ButtonGroup>
            <Button onPress={props.onDismiss}>
              {stringFormatter.format('cancel')}
            </Button>
          </ButtonGroup>
        </>
      ) : hasInstallationData.data ? (
        <CreateFork {...props} />
      ) : (
        <>
          <Content>
            <Flex gap="large" direction="column" marginBottom="large">
              <Text>
                You don't have permission to write to this repo so to save your
                changes, you need to fork the repo.
              </Text>
              <Text>
                To allow Keystatic to fork the repo, you need to install
                Keystatic in your account. This requires granting access to at
                least one repository or all repositories. After forking, you can
                revoke Keystatic's access to all repos beside the particular
                forked repo.
              </Text>
              {!appSlug?.value && (
                <Notice tone="critical">
                  {appSlug ? (
                    <Text>
                      The <code>{appSlug.envName}</code> environment variable
                      wasn't provided so we can't link to the GitHub app
                      installation page.
                    </Text>
                  ) : (
                    <Text>
                      Built-in forking doesn't work on this version of
                      Keystatic.
                    </Text>
                  )}
                </Notice>
              )}
            </Flex>
          </Content>
          <ButtonGroup>
            <Button onPress={props.onDismiss}>
              {stringFormatter.format('cancel')}
            </Button>
            {appSlug?.value && (
              <Button
                prominence="high"
                href={`https://github.com/apps/${appSlug.value}/installations/new/permissions?state=close&target_id=${viewer?.databaseId}`}
                target="_blank"
              >
                Install Keystatic
              </Button>
            )}
          </ButtonGroup>
        </>
      )}
    </Dialog>
  );
}

function CreateFork(props: {
  config: GitHubConfig;
  onCreate: () => void;
  onDismiss: () => void;
}) {
  const viewer = useContext(ViewerContext);
  const [state, setState] = useState<
    { kind: 'loading' | 'idle' } | { kind: 'error'; error: Error }
  >({ kind: 'idle' });
  const submitButtonId = useId();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const client = useClient();

  const [repoName, setRepoName] = useState(props.config.storage.repo.name);

  return (
    <form
      style={{ display: 'contents' }}
      onSubmit={async event => {
        event.preventDefault();
        setState({ kind: 'loading' });
        try {
          const auth = await getAuth();
          if (!auth) {
            throw new Error('Unauthorized');
          }
          const res = await fetch(
            `https://api.github.com/repos/${props.config.storage.repo.owner}/${props.config.storage.repo.name}/forks`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: repoName }),
            }
          );
          if (!res.ok) {
            throw new Error(await res.text());
          }

          let retry = 0;
          while (retry < 10) {
            retry++;

            const res = await client
              .query(
                gql`
                  query GetFork($owner: String!, $name: String!) {
                    repository(owner: $owner, name: $name) {
                      id
                      defaultBranchRef {
                        id
                        target {
                          id
                          oid
                        }
                      }
                    }
                  }
                ` as import('../__generated__/ts-gql/GetFork').type,
                { owner: viewer?.login!, name: repoName }
              )
              .toPromise();
            if (res.data?.repository?.defaultBranchRef?.target?.oid) {
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          await client
            .query(AppShellQuery, props.config.storage.repo)
            .toPromise();
          await new Promise(resolve => setTimeout(resolve, 100));
          props.onCreate();
        } catch (error) {
          setState({ kind: 'error', error: error as any });
        }
      }}
    >
      <Heading>Fork Repo</Heading>
      <Content>
        <TextField
          marginBottom="large"
          value={repoName}
          onChange={setRepoName}
          label="Repository Name"
          autoFocus
          errorMessage={
            state.kind === 'error' ? state.error.message : undefined
          }
        />
      </Content>
      <ButtonGroup align="center">
        {state.kind === 'loading' && (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <ProgressCircle
              aria-labelledby={submitButtonId}
              isIndeterminate
              size="small"
            />
          </Flex>
        )}
        <Button onPress={props.onDismiss} isDisabled={state.kind === 'loading'}>
          {stringFormatter.format('cancel')}
        </Button>
        <Button
          isDisabled={state.kind === 'loading'}
          prominence="high"
          type="submit"
          id={submitButtonId}
        >
          {stringFormatter.format('create')}
        </Button>
      </ButtonGroup>
    </form>
  );
}
