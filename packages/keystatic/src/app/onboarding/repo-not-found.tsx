import { Flex } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';

import { GitHubConfig } from '../..';
import { InstallGitHubApp } from './install-app';
import { serializeRepoConfig } from '../repo-config';
import { formatWithElements, useLocalizedString } from '../shell/i18n';

export function RepoNotFound(props: { config: GitHubConfig }) {
  const repo = serializeRepoConfig(props.config.storage.repo);
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
        <Flex justifyContent="center">
          <Heading>{stringFormatter.format('repoNotFound')}</Heading>
        </Flex>
        <Text>
          {formatWithElements(stringFormatter, 'repoNotFoundMessage', {
            repo: <a href={`https://github.com/${repo}`}>{repo}</a>,
          })}
        </Text>
        <InstallGitHubApp config={props.config} />
      </Flex>
    </Flex>
  );
}
