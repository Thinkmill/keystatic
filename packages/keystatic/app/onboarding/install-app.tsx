import { ActionButton, Button } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { Notice } from '@voussoir/notice';
import { TextField } from '@voussoir/text-field';
import { Text } from '@voussoir/typography';
import { useRouter } from '../router';
import { GitHubConfig } from '../../config';
import { createContext, useContext } from 'react';

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
  return (
    <Flex direction="column" gap="regular">
      <Flex alignItems="end" gap="regular">
        <TextField
          label="Repo Name"
          width="100%"
          isReadOnly
          value={props.config.storage.repo.name}
        />
        <ActionButton
          onPress={() => {
            navigator.clipboard.writeText(props.config.storage.repo.name);
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
