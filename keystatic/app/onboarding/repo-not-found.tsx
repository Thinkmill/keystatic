import { Button } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../../src';

export function RepoNotFound(props: { config: Config }) {
  const repo = `${props.config.repo.owner}/${props.config.repo.name}`;
  const appSlug = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG;
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
        maxWidth={400}
        elementType="form"
        action="https://github.com/settings/apps/new"
        method="post"
      >
        <Flex justifyContent="center">
          <Heading>Repo not found</Heading>
        </Flex>
        <Text>
          Keystatic is configured for the <a href={`https://github.com/${repo}`}>{repo}</a> GitHub
          repo but Keystatic isn't able to access this repo. This is either because you don't have
          access to this repo or you haven't added the GitHub app to it.
        </Text>
        {appSlug && (
          <Button prominence="high" href={`https://github.com/apps/${appSlug}/installations/new`}>
            Install the GitHub App
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
