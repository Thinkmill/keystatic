import { ActionButton, Button } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { Notice } from '@voussoir/notice';
import { TextField } from '@voussoir/text-field';
import { Heading, Text } from '@voussoir/typography';
import { useEffect } from 'react';
import { Config } from '../../src';
import cookie from 'cookie';

export function FromTemplateDeploy(props: { config: Config }) {
  const appSlug = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG;

  useEffect(() => {
    const parsedCookies = cookie.parse(document.cookie);
    const repo = `${props.config.repo.owner}/${props.config.repo.name}`;
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
  }, [props.config.repo.name, props.config.repo.owner]);

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
        <Heading>You've deployed Keystatic! 🎉</Heading>
        <Text>To start using Keystatic, you need to install the GitHub app you've created.</Text>
        <Text>
          Make sure to add the App to the <code>{props.config.repo.name}</code> repository.
        </Text>
        <Flex direction="column" gap="regular">
          <Flex alignItems="end" gap="regular">
            <TextField label="Repo Name" width="100%" isReadOnly value={props.config.repo.name} />
            <ActionButton
              onPress={() => {
                navigator.clipboard.writeText(props.config.repo.name);
              }}
            >
              Copy Repo Name
            </ActionButton>
          </Flex>
          {appSlug ? (
            <Button prominence="high" href={`https://github.com/apps/${appSlug}/installations/new`}>
              Install GitHub App
            </Button>
          ) : (
            <Notice tone="caution">
              The <code>NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG</code> environment variable wasn't
              provided so we can't link to the GitHub app installation page. You should find the App
              on GitHub and add the repo yourself.
            </Notice>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
