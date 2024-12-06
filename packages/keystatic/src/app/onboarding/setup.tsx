import { useState } from 'react';

import { Button } from '@keystar/ui/button';
import { Box, Flex } from '@keystar/ui/layout';
import { css } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Heading, Text } from '@keystar/ui/typography';
import { GitHubConfig } from '../..';
import { parseRepoConfig } from '../repo-config';

export function KeystaticSetup(props: { config: GitHubConfig }) {
  const [deployedURL, setDeployedURL] = useState('');
  const [organization, setOrganization] = useState('');
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
        elementType="form"
        action={`https://github.com${
          organization ? `/organizations/${organization}` : ''
        }/settings/apps/new`}
        method="post"
      >
        <Flex justifyContent="center">
          <Heading>Keystatic Setup</Heading>
        </Flex>
        <Text>Keystatic doesn't have the required config.</Text>
        <Text>
          If you've already created your GitHub app, make sure to add the
          following environment variables:
        </Text>
        <Box elementType="ul">
          <li>
            <code>KEYSTATIC_GITHUB_CLIENT_ID</code>
          </li>
          <li>
            <code>KEYSTATIC_GITHUB_CLIENT_SECRET</code>
          </li>
          <li>
            <code>KEYSTATIC_SECRET</code>
          </li>
        </Box>
        <Text>
          If you haven't created your GitHub app for Keystatic, you can create
          one below.
        </Text>
        <TextField
          label="Deployed App URL"
          description="This should the root of your domain. If you're not sure where Keystatic will be deployed, leave this blank and you can update the GitHub app later."
          value={deployedURL}
          onChange={setDeployedURL}
        />
        <TextField
          label="GitHub organization (if any)"
          description="You must be an owner or GitHub App manager in the organization to create the GitHub App. Leave this blank to create the app in your personal account."
          value={organization}
          onChange={setOrganization}
        />
        <Text>
          After visiting GitHub to create the GitHub app, you'll be redirected
          back here and secrets generated from GitHub will be written to your{' '}
          <code>.env</code> file.
        </Text>
        <input
          type="text"
          name="manifest"
          className={css({ display: 'none' })}
          value={JSON.stringify({
            name: `${
              parseRepoConfig(props.config.storage.repo).owner
            } Keystatic`,
            url: deployedURL
              ? new URL('/keystatic', deployedURL).toString()
              : `${window.location.origin}/keystatic`,
            public: true,
            redirect_url: `${window.location.origin}/api/keystatic/github/created-app`,
            callback_urls: [
              `${window.location.origin}/api/keystatic/github/oauth/callback`,
              `http://127.0.0.1/api/keystatic/github/oauth/callback`,
              ...(deployedURL
                ? [
                    new URL(
                      '/api/keystatic/github/oauth/callback',
                      deployedURL
                    ).toString(),
                  ]
                : []),
            ],
            request_oauth_on_install: true,
            default_permissions: {
              contents: 'write',
              metadata: 'read',
              pull_requests: 'read',
            },
          })}
        />
        <Button prominence="high" type="submit">
          Create GitHub App
        </Button>
      </Flex>
    </Flex>
  );
}
