import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { Section, Item } from '@react-stately/collections';
import { gql } from '@ts-gql/tag/no-transform';
import { assert } from 'emery';
import {
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { useMutation } from 'urql';

import { Avatar } from '@keystar/ui/avatar';
import { ActionButton, Button } from '@keystar/ui/button';
import { AlertDialog, DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { listTodoIcon } from '@keystar/ui/icon/icons/listTodoIcon';
import { logOutIcon } from '@keystar/ui/icon/icons/logOutIcon';
import { gitPullRequestIcon } from '@keystar/ui/icon/icons/gitPullRequestIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { gitForkIcon } from '@keystar/ui/icon/icons/gitForkIcon';
import { monitorIcon } from '@keystar/ui/icon/icons/monitorIcon';
import { moonIcon } from '@keystar/ui/icon/icons/moonIcon';
import { sunIcon } from '@keystar/ui/icon/icons/sunIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { userIcon } from '@keystar/ui/icon/icons/userIcon';
import { Box, Flex } from '@keystar/ui/layout';
import { ActionMenu, Menu, MenuTrigger } from '@keystar/ui/menu';
import { css, tokenSchema, useMediaQuery } from '@keystar/ui/style';
import { ColorScheme } from '@keystar/ui/types';
import { Text } from '@keystar/ui/typography';

import { CloudConfig, GitHubConfig } from '../../config';

import { BranchPicker, CreateBranchDialog } from '../branch-selection';
import { useRouter } from '../router';
import l10nMessages from '../l10n/index.json';
import {
  getRepoUrl,
  isCloudConfig,
  isGitHubConfig,
  isLocalConfig,
} from '../utils';

import { ZapLogo } from './common';
import { useAppState, useConfig } from './context';
import { BranchInfoContext, GitHubAppShellDataContext } from './data';
import { useViewer } from './viewer-data';
import { useThemeContext } from './theme';
import { serializeRepoConfig } from '../repo-config';

export const TopBar = () => {
  let config = useConfig();

  if (isCloudConfig(config)) {
    return <CloudHeader config={config} />;
  }
  if (isGitHubConfig(config)) {
    return <GithubHeader config={config} />;
  }
  if (isLocalConfig(config)) {
    return <LocalHeader />;
  }

  throw new Error('Unknown config type.');
};

export const SidebarHeader = () => {
  let config = useConfig();

  if (isCloudConfig(config)) {
    return <CloudHeader config={config} />;
  }
  if (isGitHubConfig(config)) {
    return <GithubHeader config={config} />;
  }
  if (isLocalConfig(config)) {
    return <LocalHeader />;
  }

  throw new Error('Unknown config type.');
};

// Cloud
// -----------------------------------------------------------------------------

function CloudHeader({ config }: { config: CloudConfig }) {
  return (
    <HeaderOuter>
      <BrandButton />
      <Text
        color="neutralEmphasis"
        weight="semibold"
        marginX="regular"
        truncate
        isHidden={{ below: 'tablet' }}
      >
        {config.storage.project}
      </Text>
      <Slash />
      <BranchPicker />
      <GitMenu />
      <Box flex="1" />
      <ThemeMenu />
      {/* <UserMenu /> */}
    </HeaderOuter>
  );
}

// Github
// -----------------------------------------------------------------------------

function GithubHeader({ config }: { config: GitHubConfig }) {
  return (
    <HeaderOuter>
      <BrandButton />
      <Button
        href={`https://github.com/${serializeRepoConfig(config.storage.repo)}`}
        target="_blank"
        rel="noopener noreferrer"
        prominence="low"
        isHidden={{ below: 'tablet' }}
        UNSAFE_className={css({
          paddingInline: tokenSchema.size.space.regular,
        })}
      >
        {serializeRepoConfig(config.storage.repo)}
      </Button>
      <Slash />
      <BranchPicker />
      <GitMenu />
      <Box flex="1" />
      <ThemeMenu />
      <UserMenu />
    </HeaderOuter>
  );
}

// Local
// -----------------------------------------------------------------------------

function LocalHeader() {
  return (
    <HeaderOuter>
      <BrandButton />
      <Text color="neutralEmphasis" weight="semibold">
        Keystatic
      </Text>
      <Box flex="1" />
      <ThemeMenu />
    </HeaderOuter>
  );
}

// =============================================================================
// Misc.
// =============================================================================

function BrandButton() {
  let { basePath } = useAppState();
  return (
    <Button
      aria-label="dashboard"
      prominence="low"
      href={basePath}
      UNSAFE_style={{
        marginInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`,
        padding: 0,
      }}
    >
      <ZapLogo />
    </Button>
  );
}

function Slash() {
  return (
    <Text
      aria-hidden
      color="neutralTertiary"
      role="presentation"
      isHidden={{ below: 'tablet' }}
      UNSAFE_className={css({ userSelect: 'none' })}
    >
      /
    </Text>
  );
}

function HeaderOuter({ children }: { children: ReactNode }) {
  return (
    <Flex
      elementType="header"
      // styles
      alignItems="center"
      borderBottom="muted"
      flexShrink={0}
      gap="small"
      height={{ mobile: 'element.large', tablet: 'scale.700' }}
      paddingX={{ mobile: 'medium', tablet: 'xlarge' }}
      paddingEnd={{ desktop: 'xxlarge' }}
    >
      {children}
    </Flex>
  );
}

// Theme controls
// -----------------------------------------------------------------------------

const THEME_MODE = {
  light: { icon: sunIcon, label: 'Light' },
  dark: { icon: moonIcon, label: 'Dark' },
  auto: { icon: monitorIcon, label: 'System' },
} as const;
const themeItems = Object.entries(THEME_MODE).map(([id, { icon, label }]) => ({
  id,
  icon,
  label,
}));

function ThemeMenu() {
  let { theme, setTheme } = useThemeContext();
  let matchesDark = useMediaQuery('(prefers-color-scheme: dark)');
  let icon = THEME_MODE[theme].icon;
  if (theme === 'auto') {
    icon = matchesDark ? moonIcon : sunIcon;
  }

  return (
    <MenuTrigger>
      <ActionButton
        aria-label="Theme"
        prominence="low"
        UNSAFE_className={css({ borderRadius: '50%', padding: 0 })}
      >
        <Icon src={icon} />
      </ActionButton>
      <Menu
        items={themeItems}
        onSelectionChange={([key]) => setTheme(key as ColorScheme)}
        disallowEmptySelection
        selectedKeys={[theme]}
        selectionMode="single"
      >
        {item => (
          <Item textValue={item.label}>
            <Icon src={item.icon} />
            <Text>{item.label}</Text>
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}

// User controls
// -----------------------------------------------------------------------------

function UserMenu() {
  let user = useViewer();
  let config = useConfig();
  const menuItems = useMemo(() => {
    let items = [
      {
        id: 'logout',
        label: 'Log out',
        icon: logOutIcon,
      },
    ];
    if (isCloudConfig(config)) {
      items.unshift({
        id: 'manage',
        label: 'Manage account',
        icon: userIcon,
      });
    }
    return items;
  }, [config]);

  if (!user) {
    return null;
  }

  return (
    <MenuTrigger>
      <ActionButton
        aria-label="User menu"
        prominence="low"
        UNSAFE_className={css({ borderRadius: '50%', padding: 0 })}
      >
        <Avatar
          src={user.avatarUrl}
          name={user.name ?? undefined}
          size="small"
        />
      </ActionButton>
      <>
        <Flex
          borderBottom="muted"
          gap="regular"
          marginX="regular"
          paddingY="regular"
          paddingEnd="xxlarge"
          alignItems="center"
          UNSAFE_className={css({ userSelect: 'none' })}
          aria-hidden
        >
          <Avatar
            src={user.avatarUrl}
            name={user.name ?? undefined}
            size="small"
          />
          <Flex direction="column" gap="small">
            <Text size="small" weight="semibold" color="neutralEmphasis">
              {user.name ?? user.login}
            </Text>
            <Text size="small" color="neutralTertiary">
              {user.login}
            </Text>
          </Flex>
        </Flex>
        <Menu
          items={menuItems}
          minWidth="scale.2400"
          onAction={key => {
            switch (key) {
              case 'manage':
                openBlankTargetSafely('https://keystatic.cloud/account');
                break;
              case 'logout':
                switch (config.storage.kind) {
                  case 'github':
                    window.location.href = '/api/keystatic/github/logout';
                    break;
                  case 'cloud':
                    localStorage.removeItem('keystatic-cloud-access-token');
                    window.location.reload();
                    break;
                }
            }
          }}
        >
          {item => (
            <Item textValue={item.label}>
              <Icon src={item.icon} />
              <Text>{item.label}</Text>
            </Item>
          )}
        </Menu>
      </>
    </MenuTrigger>
  );
}

// Git controls
// -----------------------------------------------------------------------------

function GitMenu() {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const data = useContext(BranchInfoContext);
  const [newBranchDialogVisible, toggleNewBranchDialog] = useReducer(
    v => !v,
    false
  );
  const [deleteBranchDialogVisible, toggleDeleteBranchDialog] = useReducer(
    v => !v,
    false
  );
  const [, deleteBranch] = useMutation(
    gql`
      mutation DeleteBranch($refId: ID!) {
        deleteRef(input: { refId: $refId }) {
          __typename
        }
      }
    ` as import('../../../__generated__/ts-gql/DeleteBranch').type
  );

  const appShellData = useContext(GitHubAppShellDataContext);
  const fork =
    appShellData?.data?.repository &&
    'forks' in appShellData.data.repository &&
    appShellData.data.repository.forks.nodes?.[0];

  type GitItem = {
    icon: ReactElement;
    label: string;
    description?: string;
    key: string;
  };
  type GitSection = { key: string; label: string; children: GitItem[] };
  const gitMenuItems = useMemo(() => {
    let isDefaultBranch = data.currentBranch === data.defaultBranch;
    let items: GitSection[] = [];
    let branchSection: GitItem[] = [
      {
        key: 'new-branch',
        icon: gitBranchPlusIcon,
        label: stringFormatter.format('newBranch'),
      },
    ];
    let prSection: GitItem[] = [];
    let repoSection: GitItem[] = [
      {
        key: 'repo',
        icon: githubIcon,
        label: 'Github repo', // TODO: l10n
      },
    ];

    if (!isDefaultBranch) {
      prSection.push({
        key: 'create-pull-request',
        icon: gitPullRequestIcon,
        label: stringFormatter.format('createPullRequest'),
      });
      if (!data.hasPullRequests) {
        branchSection.push({
          key: 'delete-branch',
          icon: trash2Icon,
          label: stringFormatter.format('deleteBranch'),
        });
      }
    }

    if (data.hasPullRequests) {
      prSection.push({
        key: 'related-pull-requests',
        icon: listTodoIcon,
        label: stringFormatter.format('viewPullRequests'),
      });
    }
    if (fork) {
      repoSection.push({
        key: 'fork',
        icon: gitForkIcon,
        label: 'View fork', // TODO: l10n
      });
    }

    if (branchSection.length) {
      items.push({
        key: 'branch-section',
        label: stringFormatter.format('branches'),
        children: branchSection,
      });
    }
    if (prSection.length) {
      items.push({
        key: 'pr-section',
        label: stringFormatter.format('pullRequests'),
        children: prSection,
      });
    }
    if (repoSection.length) {
      items.push({
        key: 'repo-section',
        label: 'Repository', // TODO: l10n
        children: repoSection,
      });
    }

    return items;
  }, [
    fork,
    data.currentBranch,
    data.defaultBranch,
    data.hasPullRequests,
    stringFormatter,
  ]);
  const router = useRouter();
  return (
    <>
      <ActionMenu
        aria-label="git actions"
        prominence="low"
        items={gitMenuItems}
        onAction={key => {
          let repoURL = getRepoUrl(data);
          switch (key) {
            case 'new-branch':
              toggleNewBranchDialog();
              break;
            case 'delete-branch': {
              toggleDeleteBranchDialog();
              break;
            }
            case 'related-pull-requests':
              let query = [
                ['is', 'pr'],
                ['is', 'open'],
                ['head', data.currentBranch],
              ]
                .map(([key, value]) => encodeURIComponent(`${key}:${value}`))
                .join('+');

              openBlankTargetSafely(`${repoURL}/pulls?q=${query}`);
              break;
            case 'create-pull-request':
              openBlankTargetSafely(
                `${repoURL}/pull/new/${data.currentBranch}`
              );
              break;
            case 'repo':
              openBlankTargetSafely(repoURL);
              break;
            case 'fork':
              assert(!!fork);
              openBlankTargetSafely(
                `https://github.com/${fork.owner.login}/${fork.name}`
              );
          }
        }}
      >
        {item => (
          <Section key={item.key} items={item.children} aria-label={item.label}>
            {item => (
              <Item key={item.key} textValue={item.label}>
                <Icon src={item.icon} />
                <Text>{item.label}</Text>
              </Item>
            )}
          </Section>
        )}
      </ActionMenu>

      <DialogContainer onDismiss={toggleNewBranchDialog}>
        {newBranchDialogVisible && (
          <CreateBranchDialog
            onDismiss={toggleNewBranchDialog}
            onCreate={branchName => {
              toggleNewBranchDialog();
              router.push(
                router.href.replace(
                  /\/branch\/[^/]+/,
                  '/branch/' + encodeURIComponent(branchName)
                )
              );
            }}
          />
        )}
      </DialogContainer>

      <DialogContainer onDismiss={toggleDeleteBranchDialog}>
        {deleteBranchDialogVisible && (
          <AlertDialog
            title="Delete branch"
            tone="critical"
            cancelLabel="Cancel"
            primaryActionLabel="Yes, delete"
            autoFocusButton="cancel"
            onPrimaryAction={async () => {
              await deleteBranch({
                refId: data.branchNameToId.get(data.currentBranch)!,
              });
              router.push(
                router.href.replace(
                  /\/branch\/[^/]+/,
                  '/branch/' + encodeURIComponent(data.defaultBranch)
                )
              );
            }}
          >
            Are you sure you want to delete the "{data.currentBranch}" branch?
            This cannot be undone.
          </AlertDialog>
        )}
      </DialogContainer>
    </>
  );
}

// ============================================================================
// Utils
// ============================================================================

function openBlankTargetSafely(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
