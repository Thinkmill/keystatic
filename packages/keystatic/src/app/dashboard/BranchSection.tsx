import { ActionButton } from '@keystar/ui/button';
import { DialogTrigger } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { gitPullRequestIcon } from '@keystar/ui/icon/icons/gitPullRequestIcon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { CreateBranchDialog } from '../branch-selection';
import { DashboardSection } from './components';
import { useRouter } from '../router';
import { useCurrentBranch, useRepoInfo } from '../shell/data';
import { useLocalizedString } from '../shell/i18n';
import { getRepoUrl } from '../utils';
import { useAssociatedPullRequest } from '../shell/sidebar/components';

export function BranchSection() {
  let repoInfo = useRepoInfo();
  let currentBranch = useCurrentBranch();
  let router = useRouter();
  let localizedString = useLocalizedString();
  let prNumber = useAssociatedPullRequest();

  let repoURL = repoInfo && getRepoUrl(repoInfo);
  let isDefaultBranch = currentBranch === repoInfo?.defaultBranch;

  return (
    <DashboardSection title={localizedString.format('currentBranch')}>
      <Flex
        alignItems="center"
        gap="regular"
        border="muted"
        borderRadius="medium"
        backgroundColor="canvas"
        padding="large"
      >
        <Icon src={gitBranchIcon} color="neutralTertiary" />
        <Text size="medium" weight="semibold">
          {currentBranch}
        </Text>
      </Flex>
      <Flex gap="regular" wrap>
        <DialogTrigger>
          <ActionButton>
            <Icon src={gitBranchPlusIcon} />
            <Text>{localizedString.format('newBranch')}</Text>
          </ActionButton>
          {close => (
            <CreateBranchDialog
              onDismiss={close}
              onCreate={branchName => {
                close();
                router.push(
                  router.href.replace(
                    /\/branch\/[^/]+/,
                    '/branch/' + encodeURIComponent(branchName)
                  )
                );
              }}
            />
          )}
        </DialogTrigger>

        {!isDefaultBranch &&
          prNumber !== undefined &&
          (prNumber === false ? (
            <ActionButton
              href={`${repoURL}/pull/new/${currentBranch}`}
              target="_blank"
            >
              <Icon src={gitPullRequestIcon} />
              <Text>{localizedString.format('createPullRequest')}</Text>
            </ActionButton>
          ) : (
            <ActionButton href={`${repoURL}/pull/${prNumber}`} target="_blank">
              <Icon src={gitPullRequestIcon} />
              <Text>Pull request #{prNumber}</Text>
            </ActionButton>
          ))}
      </Flex>
    </DashboardSection>
  );
}
