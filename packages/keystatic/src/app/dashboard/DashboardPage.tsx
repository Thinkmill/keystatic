import { useLocalizedStringFormatter } from '@react-aria/i18n';

import { Avatar } from '@keystar/ui/avatar';
import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { Flex } from '@keystar/ui/layout';
import { Heading } from '@keystar/ui/typography';

import { Config } from '../../config';
import l10nMessages from '../l10n/index.json';
import { AppShellBody, AppShellRoot } from '../shell';
import { AppShellHeader } from '../shell/header';
import { useViewer } from '../shell/viewer-data';
import { BranchSection } from './BranchSection';
import { CollectionSection } from './CollectionSection';
import { SingletonSection } from './SingletonSection';

export function DashboardPage(props: { config: Config; basePath: string }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const user = useViewer();

  return (
    <AppShellRoot containerWidth="large">
      <AppShellHeader onlyShowOnMobile>
        <Breadcrumbs flex minWidth={0}>
          <Item key="dashboard">{stringFormatter.format('dashboard')}</Item>
        </Breadcrumbs>
      </AppShellHeader>
      <AppShellBody isScrollable>
        <Flex direction="column" gap="xxlarge">
          {user && (
            <Flex
              alignItems="center"
              gap="medium"
              isHidden={{ below: 'tablet' }}
            >
              <Avatar
                src={user.avatarUrl}
                name={user.name ?? undefined}
                size="medium"
              />
              <Heading size="large" elementType="p">
                Hello, {user.name ?? user.login}!
              </Heading>
            </Flex>
          )}

          <BranchSection config={props.config} />
          <CollectionSection basePath={props.basePath} config={props.config} />
          <SingletonSection basePath={props.basePath} config={props.config} />
        </Flex>
      </AppShellBody>
    </AppShellRoot>
  );
}
