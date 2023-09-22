import { useLocalizedStringFormatter } from '@react-aria/i18n';

import { Avatar } from '@keystar/ui/avatar';
import { Flex, VStack } from '@keystar/ui/layout';
import { Heading } from '@keystar/ui/typography';

import { Config } from '../../config';
import l10nMessages from '../l10n/index.json';
import { PageBody, PageHeader, PageRoot } from '../shell/page';
import { useViewer } from '../shell/viewer-data';
import { BranchSection } from './BranchSection';
import { CollectionSection } from './CollectionSection';
import { SingletonSection } from './SingletonSection';
import { tokenSchema } from '@keystar/ui/style';
import { ImagesSection } from './ImagesSection';
import { useCloudInfo } from '../shell/data';
import { TextLink } from '@keystar/ui/link';

export function DashboardPage(props: { config: Config; basePath: string }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const viewer = useViewer();
  const cloudInfo = useCloudInfo();

  const user = viewer
    ? { name: viewer.name ?? viewer.login, avatarUrl: viewer.avatarUrl }
    : cloudInfo?.user;

  return (
    <PageRoot containerWidth="large">
      <PageHeader>
        <Heading elementType="h1" id="page-title" size="small">
          {stringFormatter.format('dashboard')}
        </Heading>
      </PageHeader>
      <PageBody isScrollable>
        <Flex direction="column" gap="xxlarge">
          {user && <UserInfo user={user} manageAccount={!!cloudInfo} />}

          <BranchSection config={props.config} />
          <ImagesSection />
          <CollectionSection basePath={props.basePath} config={props.config} />
          <SingletonSection basePath={props.basePath} config={props.config} />
        </Flex>
      </PageBody>
    </PageRoot>
  );
}

function UserInfo({
  user,
  manageAccount,
}: {
  user: { avatarUrl?: string; name: string };
  manageAccount: boolean;
}) {
  return (
    <Flex alignItems="center" gap="medium" isHidden={{ below: 'tablet' }}>
      <Avatar src={user.avatarUrl} name={user.name} size="large" />
      <VStack gap="medium">
        <Heading
          size="medium"
          elementType="p"
          UNSAFE_style={{
            fontWeight: tokenSchema.typography.fontWeight.bold,
          }}
        >
          Hello, {user.name}!
        </Heading>
        {manageAccount && (
          <TextLink href="https://keystatic.cloud/account">
            Manage Account
          </TextLink>
        )}
      </VStack>
    </Flex>
  );
}
