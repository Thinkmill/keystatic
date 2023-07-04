import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { Section, Item } from '@react-stately/collections';
import { gql } from '@ts-gql/tag/no-transform';
import { ReactElement, useContext, useMemo, useReducer } from 'react';
import { useMutation } from 'urql';

import { AlertDialog, DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Flex } from '@keystar/ui/layout';
import { ActionMenu } from '@keystar/ui/menu';
import { Text } from '@keystar/ui/typography';

import { useRouter } from '../router';
import { BranchPicker, CreateBranchDialog } from '../branch-selection';
import l10nMessages from '../l10n/index.json';
import { BranchInfoContext } from './data';
import { getRepoUrl } from '../utils';

export function SidebarHeader() {
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

    if (!isDefaultBranch) {
      prSection.push({
        key: 'create-pull-request',
        icon: externalLinkIcon,
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
        icon: externalLinkIcon,
        label: stringFormatter.format('viewPullRequests'),
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

    return items;
  }, [
    data.currentBranch,
    data.defaultBranch,
    data.hasPullRequests,
    stringFormatter,
  ]);
  const router = useRouter();
  return (
    <Flex
      gap="regular"
      paddingX="xlarge"
      borderBottom="muted"
      height="element.xlarge"
      alignItems="center"
    >
      <BranchPicker
        currentBranch={data.currentBranch}
        defaultBranch={data.defaultBranch}
        allBranches={data.allBranches}
      />

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

              window.open(`${repoURL}/pulls?q=${query}`);
              break;
            case 'create-pull-request':
              window.open(`${repoURL}/pull/new/${data.currentBranch}`);
              break;
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
    </Flex>
  );
}
