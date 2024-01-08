import { ActionButton, Button } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';
import { useRouter } from '../router';
import { Config, GitHubConfig } from '../../config';
import { ReactNode, createContext, useCallback, useContext } from 'react';
import { parseRepoConfig } from '../repo-config';
import { ProgressCircle } from '@keystar/ui/progress';
import { useData } from '../useData';
import { getAuth } from '../auth';

export const AppSlugContext = createContext<string | undefined>(undefined);

export function AppSlugProvider(props: {
  children: ReactNode;
  config: Config;
  value: string | undefined;
}) {
  const appSlug = props.value;
  const appSlugFromAPI = useData(
    useCallback(async () => {
      if (appSlug || props.config.storage.kind !== 'github') return;
      const auth = await getAuth(props.config);
      if (!auth) return;
      return fetch('')
        .then(res => res.json())
        .then((json): string | undefined => json.slug);
    }, [appSlug, props.config])
  );
  return (
    <AppSlugContext.Provider
      value={
        appSlug ??
        (appSlugFromAPI.kind === 'loaded' ? appSlugFromAPI.data : undefined)
      }
    >
      {props.children}
    </AppSlugContext.Provider>
  );
}

export function InstallGitHubApp(props: { config: GitHubConfig }) {
  const router = useRouter();
  const appSlugFromContext = useContext(AppSlugContext);
  const appSlug =
    new URL(router.href, 'https://example.com').searchParams.get('slug') ??
    appSlugFromContext;
  const parsedRepo = parseRepoConfig(props.config.storage.repo);
  return (
    <Flex direction="column" gap="regular">
      <Flex alignItems="end" gap="regular">
        <TextField
          label="Repo Name"
          width="100%"
          isReadOnly
          value={parsedRepo.name}
        />
        <ActionButton
          onPress={() => {
            navigator.clipboard.writeText(parsedRepo.name);
          }}
        >
          Copy Repo Name
        </ActionButton>
      </Flex>
      {appSlug ? (
        <Button
          prominence="high"
          href={`https://github.com/apps/${appSlug}/installations/new`}
        >
          Install GitHub App
        </Button>
      ) : appSlugFromContext ? (
        <Notice tone="caution">
          <Text>Find the App on GitHub and add the repo.</Text>
        </Notice>
      ) : (
        <ProgressCircle />
      )}
    </Flex>
  );
}
