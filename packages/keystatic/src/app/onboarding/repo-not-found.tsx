import { Flex } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';

import { GitHubConfig } from '../..';
import { InstallGitHubApp } from './install-app';
import { serializeRepoConfig } from '../repo-config';

export function RepoNotFound(props: { config: GitHubConfig }) {
  const repo = serializeRepoConfig(props.config.storage.repo);
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
          <Heading>Repo not found</Heading>
        </Flex>
        <Text>
          Keystatic is configured for the{' '}
          <a href={`https://github.com/${repo}`}>{repo}</a> GitHub repo but
          Keystatic isn't able to access this repo. This is either because you
          don't have access to this repo or you haven't added the GitHub app to
          it.
        </Text>
        <InstallGitHubApp config={props.config} />
      </Flex>
    </Flex>
  );
}
