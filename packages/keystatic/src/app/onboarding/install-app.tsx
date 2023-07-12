import { ActionButton, Button } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';
import { useRouter } from '../router';
import { GitHubConfig } from '../../config';
import { createContext, useContext } from 'react';
import { parseRepoConfig } from '../repo-config';

export const AppSlugContext = createContext<
  { envName: string; value: string | undefined } | undefined
>(undefined);

export const AppSlugProvider = AppSlugContext.Provider;

export function InstallGitHubApp(props: { config: GitHubConfig }) {
  const router = useRouter();
  const appSlugFromContext = useContext(AppSlugContext);
  const appSlug =
    new URL(router.href, 'https://example.com').searchParams.get('slug') ??
    appSlugFromContext?.value;
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
      ) : (
        <Notice tone="caution">
          {appSlugFromContext ? (
            <Text>
              The <code>{appSlugFromContext.envName}</code> environment variable
              wasn't provided so we can't link to the GitHub app installation
              page. You should find the App on GitHub and add the repo yourself.
            </Text>
          ) : (
            <Text>Find the App on GitHub and add the repo.</Text>
          )}
        </Notice>
      )}
    </Flex>
  );
}
