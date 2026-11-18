import { ActionButton, Button } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';
import { useRouter } from '../router';
import { GitHubConfig } from '../../config';
import { createContext, useContext } from 'react';
import { parseRepoConfig } from '../repo-config';
import { formatWithElements, useLocalizedString } from '../shell/i18n';

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
  const stringFormatter = useLocalizedString();
  return (
    <Flex direction="column" gap="regular">
      <Flex alignItems="end" gap="regular">
        <TextField
          label={stringFormatter.format('repoName')}
          width="100%"
          isReadOnly
          value={parsedRepo.name}
        />
        <ActionButton
          onPress={() => {
            navigator.clipboard.writeText(parsedRepo.name);
          }}
        >
          {stringFormatter.format('copyRepoName')}
        </ActionButton>
      </Flex>
      {appSlug ? (
        <Button
          prominence="high"
          href={`https://github.com/apps/${appSlug}/installations/new`}
        >
          {stringFormatter.format('installGitHubApp')}
        </Button>
      ) : (
        <Notice tone="caution">
          {appSlugFromContext ? (
            <Text>
              {formatWithElements(
                stringFormatter,
                'appSlugEnvironmentVariableMissing',
                { envName: <code>{appSlugFromContext.envName}</code> }
              )}
            </Text>
          ) : (
            <Text>{stringFormatter.format('findGitHubAppAndAddRepo')}</Text>
          )}
        </Notice>
      )}
    </Flex>
  );
}
