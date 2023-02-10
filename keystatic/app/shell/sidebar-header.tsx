import { Section, Item } from '@react-stately/collections';
import { DialogContainer } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { externalLinkIcon } from '@voussoir/icon/icons/externalLinkIcon';
import { gitBranchPlusIcon } from '@voussoir/icon/icons/gitBranchPlusIcon';
import { Flex } from '@voussoir/layout';
import { ActionMenu } from '@voussoir/menu';
import { Text } from '@voussoir/typography';
import router from 'next/router';
import { ReactElement, useMemo, useReducer } from 'react';
import { BranchPicker, CreateBranchDialog } from '../branch-selection';

export function SidebarHeader(props: {
  currentBranch: string;
  defaultBranch: string;
  baseCommit: string;
  repositoryId: string;
  hasPullRequests: boolean;
  allBranches: string[];
  repo: { owner: string; name: string };
}) {
  const [newBranchDialogVisible, toggleNewBranchDialog] = useReducer(v => !v, false);
  type GitItem = { icon: ReactElement; label: string; description: string; key: string };
  type GitSection = { key: string; label: string; children: GitItem[] };
  const gitMenuItems = useMemo(() => {
    let isDefaultBranch = props.currentBranch === props.defaultBranch;
    let items: GitSection[] = [
      {
        key: 'branch-section',
        label: 'Branches',
        children: [
          {
            key: 'new-branch',
            icon: gitBranchPlusIcon,
            label: 'New branch',
            description: `Create a new branch based on "${props.currentBranch}"`,
          },
        ],
      },
    ];
    let prSection: GitItem[] = [];
    if (!isDefaultBranch) {
      prSection.push({
        key: 'create-pull-request',
        icon: externalLinkIcon,
        label: 'Create pull request',
        description: 'Open a PR against this branch',
      });
    }

    if (props.hasPullRequests) {
      prSection.push({
        key: 'related-pull-requests',
        icon: externalLinkIcon,
        label: 'View pull requests',
        description: 'See the PRs for this branch',
      });
    }

    if (prSection.length) {
      items.push({
        key: 'pr-section',
        label: 'Pull requests',
        children: prSection,
      });
    }

    return items;
  }, [props.currentBranch, props.defaultBranch, props.hasPullRequests]);
  return (
    <Flex gap="regular" paddingX="xlarge" borderBottom="muted" height="xlarge" alignItems="center">
      <BranchPicker
        currentBranch={props.currentBranch}
        defaultBranch={props.defaultBranch}
        allBranches={props.allBranches}
      />
      <ActionMenu
        aria-label="git actions"
        prominence="low"
        items={gitMenuItems}
        onAction={key => {
          let repoURL = `https://github.com/${props.repo.owner}/${props.repo.name}`;
          switch (key) {
            case 'new-branch':
              toggleNewBranchDialog();
              break;
            case 'related-pull-requests':
              let query = [
                ['is', 'pr'],
                ['is', 'open'],
                ['head', props.currentBranch],
              ]
                .map(([key, value]) => encodeURIComponent(`${key}:${value}`))
                .join('+');

              window.open(`${repoURL}/pulls?q=${query}`);
              break;
            case 'create-pull-request':
              window.open(`${repoURL}/pull/new/${props.currentBranch}`);
              break;
          }
        }}
      >
        {item => (
          <Section key={item.key} items={item.children} aria-label={item.label}>
            {item => (
              <Item key={item.key}>
                <Icon src={item.icon} />
                <Text>{item.label}</Text>
                <Text slot="description">{item.description}</Text>
              </Item>
            )}
          </Section>
        )}
      </ActionMenu>

      <DialogContainer onDismiss={toggleNewBranchDialog}>
        {newBranchDialogVisible && (
          <CreateBranchDialog
            onDismiss={close}
            onCreate={branchName => {
              close();
              router.push(router.asPath.replace(/\/branch\/[^/]+/, '/branch/' + branchName));
            }}
            branchOid={props.baseCommit}
            repositoryId={props.repositoryId}
          />
        )}
      </DialogContainer>
    </Flex>
  );
}
