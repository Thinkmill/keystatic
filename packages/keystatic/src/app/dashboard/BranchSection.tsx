import { ActionButton } from '@keystar/ui/button';
import { DialogTrigger } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { gitPullRequestIcon } from '@keystar/ui/icon/icons/gitPullRequestIcon';
import { Box, Flex, VStack } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { CreateBranchDialog } from '../branch-selection';
import { useRouter } from '../router';
import { useCurrentBranch, useRepoInfo } from '../shell/data';
import { useLocalizedString } from '../shell/i18n';
import { getRepoUrl } from '../utils';
import { useAssociatedPullRequest } from '../shell/sidebar/components';

import { DashboardSection } from './components';

export function BranchSection() {
  const repoInfo = useRepoInfo();
  const currentBranch = useCurrentBranch();
  const router = useRouter();
  const localizedString = useLocalizedString();
  const prNumber = useAssociatedPullRequest();

  const repoURL = repoInfo && getRepoUrl(repoInfo);
  const isDefaultBranch = currentBranch === repoInfo?.defaultBranch;

  return (
    <DashboardSection title={localizedString.format('currentBranch')}>
      <Flex gap="large" alignItems="center" wrap>
        <Box
          borderRadius="large"
          padding={{ mobile: 'large', tablet: 'xlarge' }}
          flex
          UNSAFE_className={css({
            border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
            backgroundColor: tokenSchema.color.background.surface,
            boxShadow: `0 14px 28px ${tokenSchema.color.shadow.muted}`,
          })}
        >
          <Flex alignItems="center" gap="large" wrap>
            <Box
              borderRadius="large"
              padding="regular"
              UNSAFE_className={css({
                backgroundColor: tokenSchema.color.scale.indigo3,
                color: tokenSchema.color.scale.indigo9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Icon src={gitBranchIcon} />
            </Box>
            <VStack gap="xsmall">
              <Text color="neutralSecondary" size="small">
                Active branch
              </Text>
              <Text weight="semibold">{currentBranch}</Text>
            </VStack>
          </Flex>
        </Box>

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
              <ActionButton
                href={`${repoURL}/pull/${prNumber}`}
                target="_blank"
              >
                <Icon src={gitPullRequestIcon} />
                <Text>Pull request #{prNumber}</Text>
              </ActionButton>
            ))}
        </Flex>
      </Flex>
    </DashboardSection>
  );
}
