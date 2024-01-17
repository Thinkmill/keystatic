import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { PressProps } from '@react-aria/interactions';
import { Section, Item } from '@react-stately/collections';
import {
  ForwardedRef,
  ReactElement,
  forwardRef,
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
import { Flex } from '@keystar/ui/layout';
import { ActionMenu, Menu, MenuTrigger } from '@keystar/ui/menu';
import { ClearSlots } from '@keystar/ui/slots';
import { css, useMediaQuery } from '@keystar/ui/style';
import { ColorScheme } from '@keystar/ui/types';
import { Text } from '@keystar/ui/typography';

import { CreateBranchDialog } from '../../branch-selection';
import { useRouter } from '../../router';
import l10nMessages from '../../l10n/index.json';
import { getRepoUrl, isGitHubConfig, redirectToCloudAuth } from '../../utils';

import { useConfig } from '../context';
import {
  BaseRepo,
  BranchInfoContext,
  GitHubAppShellDataContext,
  useCloudInfo,
  useRawCloudInfo,
} from '../data';
import { useViewer } from '../viewer-data';
import { useThemeContext } from '../theme';
import { useImageLibraryURL } from '../../../component-blocks/cloud-image-preview';
import { clearObjectCache } from '../../object-cache';
import { clearDrafts } from '../../persistence';
import { graphql } from '../../../graphql';
import { readFragment } from 'gql.tada';

type MenuItem = {
  icon: ReactElement;
  label: string;
  description?: string;
  key: string;
  href?: string;
  target?: string;
  rel?: string;
};
type MenuSection = { key: string; label: string; children: MenuItem[] };

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

export function ThemeMenu() {
  let { theme, setTheme } = useThemeContext();
  let matchesDark = useMediaQuery('(prefers-color-scheme: dark)');
  let icon = THEME_MODE[theme].icon;
  if (theme === 'auto') {
    icon = matchesDark ? moonIcon : sunIcon;
  }

  return (
    <MenuTrigger align="end">
      <ActionButton aria-label="theme" prominence="low">
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

type UserData = {
  name: string;
  avatarUrl?: string;
  login: string;
};

export function UserActions() {
  let config = useConfig();
  let userData = useUserData();
  let router = useRouter();

  if (!userData) {
    return null;
  }

  if (userData === 'unauthorized') {
    return (
      <ActionButton
        onPress={() => {
          redirectToCloudAuth(
            router.params.map(encodeURIComponent).join('/'),
            config
          );
        }}
        flex
      >
        Sign into Cloud
      </ActionButton>
    );
  }

  return <UserMenu {...userData} />;
}

export function UserMenu(user: {
  name: string;
  avatarUrl?: string;
  login: string;
}) {
  let config = useConfig();
  const cloudInfo = useCloudInfo();
  const imageLibraryUrl = useImageLibraryURL();

  const menuItems = useMemo(() => {
    let items: MenuItem[] = [
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
    if (cloudInfo?.team.images) {
      items.unshift({
        key: 'image-library',
        label: 'Image library',
        icon: imageIcon,
        href: imageLibraryUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    }
    return items;
  }, [cloudInfo, config, imageLibraryUrl]);

  if (!user) {
    return null;
  }

  return (
    <MenuTrigger>
      <UserDetailsButton {...user} />
      <>
        <Menu
          items={menuItems}
          minWidth="scale.2400"
          onAction={async key => {
            await Promise.all([clearObjectCache(), clearDrafts()]);
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

const UserDetailsButton = forwardRef(function UserDetailsButton(
  props: UserData & PressProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  let { avatarUrl, login, name, ...otherProps } = props;
  return (
    <ActionButton
      {...otherProps}
      ref={ref}
      aria-label="User menu"
      prominence="low"
      flexGrow={1}
      UNSAFE_className={css({ justifyContent: 'start', textAlign: 'start' })}
    >
      <Flex alignItems="center" gap="regular">
        <Avatar src={avatarUrl} name={name ?? undefined} size="small" />
        <ClearSlots>
          <Flex direction="column" gap="small">
            <Text size="small" weight="semibold" color="neutralEmphasis">
              {name}
            </Text>
            {name === login ? null : (
              <Text size="small" color="neutralTertiary">
                {login}
              </Text>
            )}
          </Flex>
        </ClearSlots>
      </Flex>
    </ActionButton>
  );
});

// Git controls
// -----------------------------------------------------------------------------

export function GitMenu() {
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
    graphql(`
      mutation DeleteBranch($refId: ID!) {
        deleteRef(input: { refId: $refId }) {
          __typename
        }
      }
    `)
  );

  const repoURL = getRepoUrl(data);
  const appShellData = useContext(GitHubAppShellDataContext);
  const fork =
    appShellData?.data?.repository &&
    'forks' in appShellData.data.repository &&
    appShellData.data.repository.forks.nodes?.[0] &&
    readFragment(BaseRepo, appShellData.data.repository.forks.nodes[0]);

  const gitMenuItems = useMemo(() => {
    let isDefaultBranch = data.currentBranch === data.defaultBranch;
    let items: MenuSection[] = [];
    let branchSection: MenuItem[] = [
      {
        key: 'new-branch',
        icon: gitBranchPlusIcon,
        label: stringFormatter.format('newBranch'),
      },
    ];
    let prSection: MenuItem[] = [];
    let repoSection: MenuItem[] = [
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
        align="end"
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

// Utils
// -----------------------------------------------------------------------------

function useUserData(): UserData | 'unauthorized' | undefined {
  const config = useConfig();
  const user = useViewer();
  const rawCloudInfo = useRawCloudInfo();

  if (rawCloudInfo) {
    if (rawCloudInfo === 'unauthorized') {
      return rawCloudInfo;
    }

    return {
      avatarUrl: rawCloudInfo.user.avatarUrl,
      login: rawCloudInfo.user.email,
      name: rawCloudInfo.user.name,
    };
  }

  if (isGitHubConfig(config) && user) {
    return {
      avatarUrl: user.avatarUrl,
      login: user.login,
      name: user.name ?? user.login,
    };
  }

  return undefined;
}
