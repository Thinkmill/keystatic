import { ActionButton, Button } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { Notice } from '@voussoir/notice';
import { TextField } from '@voussoir/text-field';
import { Heading, Text } from '@voussoir/typography';
import { useRouter } from 'next/router';
import { Config } from '../../src';

export function CreatedGitHubApp(props: { config: Config }) {
  const router = useRouter();
  const appSlug = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG ?? router.query.slug;
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
        <Heading>You've installed Keystatic! 🎉</Heading>
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
