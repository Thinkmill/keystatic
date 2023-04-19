import { Flex } from '@voussoir/layout';
import { Heading, Text } from '@voussoir/typography';
import { GitHubConfig } from '../..';
import { InstallGitHubApp } from './install-app';

export function CreatedGitHubApp(props: { config: GitHubConfig }) {
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
        <Heading>You've installed Keystatic! 🎉</Heading>
        <Text>
          To start using Keystatic, you need to install the GitHub app you've
          created.
        </Text>
        <Text>
          Make sure to add the App to the{' '}
          <code>{props.config.storage.repo.name}</code> repository.
        </Text>
        <InstallGitHubApp config={props.config} />
      </Flex>
    </Flex>
  );
}
