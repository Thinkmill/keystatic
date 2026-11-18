import { useState } from 'react';

import { Button } from '@keystar/ui/button';
import { Box, Flex } from '@keystar/ui/layout';
import { css } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Heading, Text } from '@keystar/ui/typography';
import { GitHubConfig } from '../..';
import { parseRepoConfig } from '../repo-config';
import { formatWithElements, useLocalizedString } from '../shell/i18n';

export function KeystaticSetup(props: { config: GitHubConfig }) {
  const [deployedURL, setDeployedURL] = useState('');
  const [organization, setOrganization] = useState('');
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
        elementType="form"
        action={`https://github.com${
          organization ? `/organizations/${organization}` : ''
        }/settings/apps/new`}
        method="post"
      >
        <Flex justifyContent="center">
          <Heading>{stringFormatter.format('keystaticSetup')}</Heading>
        </Flex>
        <Text>{stringFormatter.format('keystaticSetupMissingConfig')}</Text>
        <Text>
          {stringFormatter.format('keystaticSetupEnvironmentVariables')}
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
        <Text>{stringFormatter.format('keystaticSetupCreateApp')}</Text>
        <TextField
          label={stringFormatter.format('deployedAppUrl')}
          description={stringFormatter.format('deployedAppUrlDescription')}
          value={deployedURL}
          onChange={setDeployedURL}
        />
        <TextField
          label={stringFormatter.format('githubOrganization')}
          description={stringFormatter.format('githubOrganizationDescription')}
          value={organization}
          onChange={setOrganization}
        />
        <Text>
          {formatWithElements(stringFormatter, 'keystaticSetupRedirect', {
            envFile: <code>.env</code>,
          })}
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
          {stringFormatter.format('createGitHubApp')}
        </Button>
      </Flex>
    </Flex>
  );
}
