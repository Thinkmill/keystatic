import { Flex } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';
import { GitHubConfig } from '../..';
import { InstallGitHubApp } from './install-app';
import { serializeRepoConfig } from '../repo-config';
import { formatWithElements, useLocalizedString } from '../shell/i18n';

export function CreatedGitHubApp(props: { config: GitHubConfig }) {
  const stringFormatter = useLocalizedString();
  return (
    <Flex alignItems="center" justifyContent="center" margin="xxlarge">
      <Flex
        backgroundColor="surface"
        padding="large"
        border="color.alias.borderIdle"
        borderRadius="medium"
        direction="column"
        justifyContent="center"
        gap="xlarge"
        maxWidth="scale.4600"
      >
        <Heading>{stringFormatter.format('installedKeystatic')}</Heading>
        <Text>{stringFormatter.format('installGitHubAppToStart')}</Text>
        <Text>
          {formatWithElements(stringFormatter, 'addGitHubAppToRepo', {
            repo: <code>{serializeRepoConfig(props.config.storage.repo)}</code>,
          })}
        </Text>
        <InstallGitHubApp config={props.config} />
      </Flex>
    </Flex>
  );
}
