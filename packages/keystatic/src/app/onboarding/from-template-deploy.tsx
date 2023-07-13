import { Flex } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';
import { useEffect } from 'react';
import { GitHubConfig } from '../..';
import cookie from 'cookie';
import { InstallGitHubApp } from './install-app';
import { serializeRepoConfig } from '../repo-config';

export function FromTemplateDeploy(props: { config: GitHubConfig }) {
  useEffect(() => {
    const parsedCookies = cookie.parse(document.cookie);
    const repo = serializeRepoConfig(props.config.storage.repo);
    const cookieName = 'ks-template';
    if (parsedCookies[cookieName] !== repo) {
      document.cookie = cookie.serialize(cookieName, repo, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
        secure: true,
        sameSite: 'lax',
      });
    }
  }, [props.config.storage.repo]);

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
        <Heading>You've deployed Keystatic! 🎉</Heading>
        <Text>
          To start using Keystatic, you need to install the GitHub app you've
          created.
        </Text>
        <Text>
          Make sure to add the App to the{' '}
          <code>{serializeRepoConfig(props.config.storage.repo)}</code>{' '}
          repository.
        </Text>
        <InstallGitHubApp config={props.config} />
      </Flex>
    </Flex>
  );
}
