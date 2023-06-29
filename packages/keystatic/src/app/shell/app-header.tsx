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

import { Avatar } from '@voussoir/avatar';
import { AlertDialog, DialogContainer } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { listTodoIcon } from '@voussoir/icon/icons/listTodoIcon';
import { gitPullRequestIcon } from '@voussoir/icon/icons/gitPullRequestIcon';
import { gitBranchPlusIcon } from '@voussoir/icon/icons/gitBranchPlusIcon';
import { githubIcon } from '@voussoir/icon/icons/githubIcon';
import { gitForkIcon } from '@voussoir/icon/icons/gitForkIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Box, Flex } from '@voussoir/layout';
import { ActionMenu } from '@voussoir/menu';
import { css } from '@voussoir/style';
import { Text } from '@voussoir/typography';

import { CloudConfig, GitHubConfig, LocalConfig } from '../../config';

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
import { useConfig } from './context';
import { BranchInfoContext, GitHubAppShellDataContext } from './data';
import { ViewerContext } from './sidebar-data';

export const AppHeader = () => {
  let config = useConfig();

  if (isCloudConfig(config)) {
    return <CloudHeader config={config} />;
  }
  if (isGitHubConfig(config)) {
    return <GithubHeader config={config} />;
  }
  if (isLocalConfig(config)) {
    return <LocalHeader config={config} />;
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
    return <LocalHeader config={config} />;
  }

  throw new Error('Unknown config type.');
};

// Cloud
// -----------------------------------------------------------------------------

function CloudHeader({ config }: { config: CloudConfig }) {
  return (
    <HeaderOuter>
      <ZapLogo />
      <Text>{config.storage.project}</Text>
      <GitControls />
    </HeaderOuter>
  );
}

// Github
// -----------------------------------------------------------------------------

function GithubHeader({ config }: { config: GitHubConfig }) {
  return (
    <HeaderOuter>
      <ZapLogo />

      <Text
        color="neutralEmphasis"
        weight="semibold"
        truncate
        isHidden={{ below: 'tablet' }}
      >
        {config.storage.repo.name}
      </Text>
      <Text
        color="neutralTertiary"
        role="presentation"
        isHidden={{ below: 'tablet' }}
        UNSAFE_className={css({ userSelect: 'none' })}
      >
        /
      </Text>
      <GitControls />
      <Box flex="1" />
      <ViewerAvatar />
    </HeaderOuter>
  );
}

// Local
// -----------------------------------------------------------------------------

function LocalHeader({ config }: { config: LocalConfig }) {
  console.log('local header', config);
  return (
    <HeaderOuter>
      <ZapLogo />
      <Text color="neutralEmphasis" weight="semibold">
        Keystatic
      </Text>
    </HeaderOuter>
  );
}

// =============================================================================
// Misc.
// =============================================================================

function HeaderOuter({ children }: { children: ReactNode }) {
  return (
    <Flex
      elementType="header"
      // styles
      alignItems="center"
      // backgroundColor="surface"
      borderBottom="muted"
      gap="regular"
      height={{ mobile: 'element.large', tablet: 'element.xlarge' }}
      paddingX={{ mobile: 'regular', tablet: 'xlarge' }}
    >
      {children}
    </Flex>
  );
}

function ViewerAvatar() {
  const viewer = useContext(ViewerContext);
  if (!viewer) {
    return null;
  }
  return (
    <Avatar
      alt={`${viewer.name ?? viewer.login} avatar`}
      src={viewer.avatarUrl ?? ''}
    />
  );
}

// Git controls
// -----------------------------------------------------------------------------

function GitControls() {
  return (
    <Flex gap="regular" alignItems="center">
      <BranchPicker />
      <GitMenu />
    </Flex>
  );
}

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
