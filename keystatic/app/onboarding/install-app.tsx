import { ActionButton, Button } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { Notice } from '@voussoir/notice';
import { TextField } from '@voussoir/text-field';
import { useRouter } from 'next/router';
import { GitHubConfig } from '../../config';

export function InstallGitHubApp(props: { config: GitHubConfig }) {
  const router = useRouter();
  const appSlug = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG ?? router.query.slug;
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
        <Button prominence="high" href={`https://github.com/apps/${appSlug}/installations/new`}>
          Install GitHub App
        </Button>
      ) : (
        <Notice tone="caution">
          The <code>NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG</code> environment variable wasn't
          provided so we can't link to the GitHub app installation page. You should find the App on
          GitHub and add the repo yourself.
        </Notice>
      )}
    </Flex>
  );
}
