import { useState } from 'react';

import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { Button } from '@keystar/ui/button';
import { Box, Flex } from '@keystar/ui/layout';
import { css } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Heading, Text } from '@keystar/ui/typography';
import { GitHubConfig } from '../..';
import { parseRepoConfig } from '../repo-config';
import l10nMessages from '../l10n';

export function KeystaticSetup(props: { config: GitHubConfig }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [deployedURL, setDeployedURL] = useState('');
  const [organization, setOrganization] = useState('');
  const basePath =
    typeof window !== 'undefined' && window.__KS_BASE_PATH__
      ? window.__KS_BASE_PATH__
      : '/keystatic';

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
          <Heading>{stringFormatter.format('setupHeading')}</Heading>
        </Flex>
        <Text>{stringFormatter.format('setupMissingConfig')}</Text>
        <Text>{stringFormatter.format('setupEnvInstructions')}</Text>
        <Box elementType="ul">
          <li>
            {/* eslint-disable-next-line react/jsx-no-literals */}
            <code>KEYSTATIC_GITHUB_CLIENT_ID</code>
          </li>
          <li>
            {/* eslint-disable-next-line react/jsx-no-literals */}
            <code>KEYSTATIC_GITHUB_CLIENT_SECRET</code>
          </li>
          <li>
            {/* eslint-disable-next-line react/jsx-no-literals */}
            <code>KEYSTATIC_SECRET</code>
          </li>
        </Box>
        <Text>{stringFormatter.format('setupCreateAppIntro')}</Text>
        <TextField
          label={stringFormatter.format('setupDeployedUrlLabel')}
          description={stringFormatter.format('setupDeployedUrlDescription')}
          value={deployedURL}
          onChange={setDeployedURL}
        />
        <TextField
          label={stringFormatter.format('setupOrganizationLabel')}
          description={stringFormatter.format('setupOrganizationDescription')}
          value={organization}
          onChange={setOrganization}
        />
        <Text>
          {stringFormatter.format('setupRedirectDescription')}
          // eslint-disable-next-line react/jsx-no-literals
          <code>.env</code>
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
              ? new URL(basePath, deployedURL).toString()
              : `${window.location.origin}${basePath}/`,
            public: true,
            redirect_url: `${window.location.origin}/api${basePath}/github/created-app/`,
            callback_urls: [
              `${window.location.origin}/api${basePath}/github/oauth/callback/`,
              `http://127.0.0.1/api${basePath}/github/oauth/callback/`,
              ...(deployedURL
                ? [
                    new URL(
                      `/api${basePath}/github/oauth/callback/`,
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
          {stringFormatter.format('setupButtonLabel')}
        </Button>
      </Flex>
    </Flex>
  );
}
