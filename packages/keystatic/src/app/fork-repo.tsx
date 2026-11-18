import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';
import { ButtonGroup, Button } from '@keystar/ui/button';
import { Dialog } from '@keystar/ui/dialog';
import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';
import { useContext, useEffect, useState } from 'react';
import l10nMessages from './l10n';
import { GitHubConfig } from '../config';
import { getAuth } from './auth';
import { useClient } from 'urql';
import { GitHubAppShellQuery } from './shell/data';
import { Notice } from '@keystar/ui/notice';
import { AppSlugContext } from './onboarding/install-app';
import { Flex } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { parseRepoConfig, serializeRepoConfig } from './repo-config';
import { formatWithElements } from './shell/i18n';

export function ForkRepoDialog(props: {
  onDismiss: () => void;
  onCreate: () => void;
  config: GitHubConfig;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  const client = useClient();
  const [state, setState] = useState<
    { kind: 'idle' | 'loading' } | { kind: 'error'; error: Error }
  >({ kind: 'idle' });

  useEffect(() => {
    const listener = async (event: StorageEvent) => {
      if (
        event.key === 'ks-refetch-installations' &&
        event.newValue === 'true'
      ) {
        localStorage.removeItem('ks-refetch-installations');
        try {
          const auth = await getAuth(props.config);
          if (!auth) throw new Error('Unauthorized');
          const res = await client
            .query(
              GitHubAppShellQuery,
              parseRepoConfig(props.config.storage.repo)
            )
            .toPromise();
          if (
            res.data?.repository?.forks.nodes?.some(
              x =>
                x?.viewerPermission === 'ADMIN' ||
                x?.viewerPermission === 'WRITE' ||
                x?.viewerPermission === 'MAINTAIN'
            )
          ) {
            await new Promise(resolve => setTimeout(resolve, 100));
            props.onCreate();
          }
        } catch (err) {
          setState({ kind: 'error', error: err as Error });
        }
      }
    };
    addEventListener('storage', listener);
    return () => removeEventListener('storage', listener);
  }, [client, props]);

  const appSlug = useContext(AppSlugContext);

  return (
    <Dialog
      size="small"
      isDismissable
      onDismiss={() => {
        props.onDismiss();
      }}
    >
      <Heading>{stringFormatter.format('forkRepo')}</Heading>
      {state.kind === 'error' ? (
        <>
          <Content>
            <Notice tone="critical">{state.error.message}</Notice>
          </Content>
          <ButtonGroup>
            <Button onPress={props.onDismiss}>
              {stringFormatter.format('cancel')}
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <Content>
            <Flex gap="large" direction="column" marginBottom="large">
              <Text>{stringFormatter.format('forkRepoNoPermission')}</Text>
              <Text>
                {formatWithElements(stringFormatter, 'forkRepoInstructions', {
                  forkLink: (
                    <TextLink
                      href={`https://github.com/${serializeRepoConfig(
                        props.config.storage.repo
                      )}/fork`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {stringFormatter.format('forkTheRepoOnGitHub')}
                    </TextLink>
                  ),
                  installLink: (
                    <TextLink
                      href={`https://github.com/apps/${appSlug?.value}/installations/new?state=close`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {stringFormatter.format('installGitHubAppOnFork')}
                    </TextLink>
                  ),
                })}
              </Text>
            </Flex>
          </Content>
        </>
      )}
    </Dialog>
  );
}
