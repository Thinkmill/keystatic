import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { Section, Item } from '@react-stately/collections';
import { gql } from '@ts-gql/tag/no-transform';
import {
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { useMutation } from 'urql';

import { Avatar } from '@keystar/ui/avatar';
import { ActionButton } from '@keystar/ui/button';
import { AlertDialog, DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { logOutIcon } from '@keystar/ui/icon/icons/logOutIcon';
import { gitPullRequestIcon } from '@keystar/ui/icon/icons/gitPullRequestIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { gitForkIcon } from '@keystar/ui/icon/icons/gitForkIcon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
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

import { BranchPicker, CreateBranchDialog } from '../branch-selection';
import { useRouter } from '../router';
import l10nMessages from '../l10n/index.json';
import {
  getRepoUrl,
  isCloudConfig,
  isGitHubConfig,
  isLocalConfig,
  redirectToCloudAuth,
} from '../utils';

import { useBrand } from './common';
import { useAppState, useConfig } from './context';
import {
  BranchInfoContext,
  GitHubAppShellDataContext,
  useCloudInfo,
  useRawCloudInfo,
} from './data';
import { useViewer } from './viewer-data';
import { useThemeContext } from './theme';
import { useImageLibraryURL } from '../../component-blocks/cloud-image-preview';

type GitItem = {
  icon: ReactElement;
  label: string;
  description?: string;
  key: string;
  href?: string;
  target?: string;
  rel?: string;
};
type GitSection = { key: string; label: string; children: GitItem[] };

export const TopBar = () => {
  let config = useConfig();

  if (isCloudConfig(config)) {
    return <CloudHeader />;
  }
  if (isGitHubConfig(config)) {
    return <GithubHeader />;
  }
  if (isLocalConfig(config)) {
    return <LocalHeader />;
  }

  throw new Error('Unknown config type.');
};

export const SidebarHeader = () => {
  let config = useConfig();

  if (isCloudConfig(config)) {
    return <CloudHeader />;
  }
  if (isGitHubConfig(config)) {
    return <GithubHeader />;
  }
  if (isLocalConfig(config)) {
    return <LocalHeader />;
  }

  throw new Error('Unknown config type.');
};

// Cloud
// -----------------------------------------------------------------------------

function CloudHeader() {
  const cloudInfo = useCloudInfo();
  return (
    <HeaderOuter>
      <BrandButton />
      <BranchPicker />
      <GitMenu />
      <Box flex="1" />
      <ImageLibraryButton />
      <ThemeMenu />
      <UserMenu
        user={
          cloudInfo
            ? {
                name: cloudInfo.user.name,
                login: cloudInfo.user.email,
                avatarUrl: cloudInfo.user.avatarUrl,
              }
            : undefined
        }
      />
    </HeaderOuter>
  );
}

function ImageLibraryButton() {
  const cloudInfo = useCloudInfo();
  const imageLibraryUrl = useImageLibraryURL();
  if (!cloudInfo?.team.images) {
    return null;
  }

  return (
    <ActionButton prominence="low" href={imageLibraryUrl} target="_blank">
      <Icon src={imageIcon} />
      <Text visuallyHidden={{ below: 'tablet' }}>Image library</Text>
    </ActionButton>
  );
}

// Github
// -----------------------------------------------------------------------------

function GithubHeader() {
  const user = useViewer();
  return (
    <HeaderOuter>
      <BrandButton />
      <BranchPicker />
      <GitMenu />
      <Box flex="1" />
      <ThemeMenu />
      <UserMenu
        user={
          user
            ? {
                login: user.login,
                name: user.name ?? user.login,
                avatarUrl: user.avatarUrl,
              }
            : undefined
        }
      />
    </HeaderOuter>
  );
}

// Local
// -----------------------------------------------------------------------------

function LocalHeader() {
  const config = useConfig();
  const rawCloudInfo = useRawCloudInfo();
  const router = useRouter();
  return (
    <HeaderOuter>
      <BrandButton />
      <Box flex="1" />
      <ImageLibraryButton />
      <ThemeMenu />
      {rawCloudInfo ? (
        rawCloudInfo === 'unauthorized' ? (
          <ActionButton
            onPress={() => {
              redirectToCloudAuth(router.params.join('/'), config);
            }}
            prominence="low"
          >
            Sign in
          </ActionButton>
        ) : (
          <UserMenu
            user={
              rawCloudInfo
                ? {
                    name: rawCloudInfo.user.name,
                    login: rawCloudInfo.user.email,
                    avatarUrl: rawCloudInfo.user.avatarUrl,
                  }
                : undefined
            }
          />
        )
      ) : null}
    </HeaderOuter>
  );
}

// =============================================================================
// Misc.
// =============================================================================

function BrandButton() {
  let { basePath } = useAppState();
  let { brandMark, brandName } = useBrand();

  return (
    <ActionButton
      aria-label="dashboard"
      prominence="low"
      href={basePath}
      UNSAFE_style={{
        marginInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`,
      }}
    >
      {brandMark}

      <Text
        color="neutralEmphasis"
        weight="medium"
        visuallyHidden={{ below: 'desktop' }}
      >
        {brandName}
      </Text>
    </ActionButton>
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

function UserMenu({
  user,
}: {
  user: { name: string; avatarUrl?: string; login: string } | undefined;
}) {
  let config = useConfig();
  const menuItems = useMemo(() => {
    let items: GitItem[] = [
      {
        key: 'logout',
        label: 'Log out',
        icon: logOutIcon,
      },
    ];
    if (config.cloud?.project) {
      items.unshift({
        key: 'manage',
        label: 'Account',
        icon: userIcon,
        href: 'https://keystatic.cloud/account',
        target: '_blank',
        rel: 'noopener noreferrer',
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
              {user.name}
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
              case 'logout':
                switch (config.storage.kind) {
                  case 'github':
                    window.location.href = '/api/keystatic/github/logout';
                    break;
                  case 'cloud':
                  case 'local':
                    localStorage.removeItem('keystatic-cloud-access-token');
                    window.location.reload();
                    break;
                }
            }
          }}
        >
          {item => (
            <Item
              key={item.key}
              textValue={item.label}
              href={item.href}
              rel={item.rel}
              target={item.target}
            >
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

  const repoURL = getRepoUrl(data);
  const appShellData = useContext(GitHubAppShellDataContext);
  const fork =
    appShellData?.data?.repository &&
    'forks' in appShellData.data.repository &&
    appShellData.data.repository.forks.nodes?.[0];

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
        href: repoURL,
        target: '_blank',
        rel: 'noopener noreferrer',
        label: 'Github repo', // TODO: l10n
      },
    ];

    if (!isDefaultBranch) {
      if (data.pullRequestNumber === undefined) {
        prSection.push({
          key: 'create-pull-request',
          icon: gitPullRequestIcon,
          href: `${repoURL}/pull/new/${data.currentBranch}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          label: stringFormatter.format('createPullRequest'),
        });
      } else {
        prSection.push({
          key: 'view-pull-request',
          icon: gitPullRequestIcon,
          href: `${repoURL}/pull/${data.pullRequestNumber}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          label: `Pull Request #${data.pullRequestNumber}`,
        });
      }
      if (data.pullRequestNumber === undefined) {
        branchSection.push({
          key: 'delete-branch',
          icon: trash2Icon,
          label: stringFormatter.format('deleteBranch'),
        });
      }
    }
    if (fork) {
      repoSection.push({
        key: 'fork',
        icon: gitForkIcon,
        href: `https://github.com/${fork.owner.login}/${fork.name}`,
        target: '_blank',
        rel: 'noopener noreferrer',
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
    data.pullRequestNumber,
    repoURL,
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
          switch (key) {
            case 'new-branch':
              toggleNewBranchDialog();
              break;
            case 'delete-branch': {
              toggleDeleteBranchDialog();
              break;
            }
          }
        }}
      >
        {item => (
          <Section key={item.key} items={item.children} aria-label={item.label}>
            {item => (
              <Item
                key={item.key}
                textValue={item.label}
                href={item.href}
                rel={item.rel}
                target={item.target}
              >
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
