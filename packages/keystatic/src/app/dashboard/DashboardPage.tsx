import { useLocalizedStringFormatter } from '@react-aria/i18n';

import { Avatar } from '@keystar/ui/avatar';
import { Flex } from '@keystar/ui/layout';
import { Heading } from '@keystar/ui/typography';

import { Config } from '../../config';
import l10nMessages from '../l10n/index.json';
import { PageBody, PageHeader, PageRoot } from '../shell/page';
import { useViewer } from '../shell/viewer-data';
import { BranchSection } from './BranchSection';
import { CollectionSection } from './CollectionSection';
import { SingletonSection } from './SingletonSection';
import { tokenSchema } from '@keystar/ui/style';

export function DashboardPage(props: { config: Config; basePath: string }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const user = useViewer();

  return (
    <PageRoot containerWidth="large">
      <PageHeader>
        <Heading elementType="h1" id="page-title" size="small">
          {stringFormatter.format('dashboard')}
        </Heading>
      </PageHeader>
      <PageBody isScrollable>
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
                size="large"
              />
              <Heading
                size="medium"
                elementType="p"
                UNSAFE_style={{
                  fontWeight: tokenSchema.typography.fontWeight.bold,
                }}
              >
                Hello, {user.name ?? user.login}!
              </Heading>
            </Flex>
          )}

          <BranchSection config={props.config} />
          <CollectionSection basePath={props.basePath} config={props.config} />
          <SingletonSection basePath={props.basePath} config={props.config} />
        </Flex>
      </PageBody>
    </PageRoot>
  );
}
