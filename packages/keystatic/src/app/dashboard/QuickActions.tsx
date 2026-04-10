import { Key } from 'react';

import { ActionButton, Button } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { settingsIcon } from '@keystar/ui/icon/icons/settingsIcon';
import { filePlusIcon } from '@keystar/ui/icon/icons/filePlusIcon';
import { Menu, MenuTrigger, Item, Section } from '@keystar/ui/menu';
import { Text } from '@keystar/ui/typography';

import { useConfig, useAppState } from '../shell/context';
import { useRouter } from '../router';
import {
  getStandalonePageCreatePath,
  useStandalonePages,
} from '../standalone-pages';

type QuickAction = {
  key: string;
  label: string;
  icon: typeof plusIcon;
  href?: string;
  onAction?: () => void;
};

export function QuickActions() {
  const config = useConfig();
  const { basePath } = useAppState();
  const router = useRouter();
  const standalonePages = useStandalonePages(basePath);
  const standalonePageSingletonKey = standalonePages.singleton?.key;

  const pageActions: QuickAction[] = standalonePages.collections.map(
    collection => ({
      key: `create-page-${collection.key}`,
      label:
        standalonePages.collections.length === 1
          ? 'New page'
          : `New ${collection.label.replace(/s$/i, '')}`,
      icon: filePlusIcon,
      href: getStandalonePageCreatePath(config, basePath, collection.key),
    })
  );

  const standalonePageCollectionKeys = new Set(
    standalonePages.collections
      .filter(collection => collection.sourceKind === 'collection')
      .map(collection => collection.key)
  );

  const collectionActions: QuickAction[] = Object.entries(
    config.collections || {}
  )
    .filter(([key]) => !standalonePageCollectionKeys.has(key))
    .map(([key, collection]) => ({
      key: `create-${key}`,
      label: `New ${collection.label}`,
      icon: plusIcon,
      href: getCreateHref(config, basePath, key, 'collection'),
    }));

  const singletonActions: QuickAction[] = Object.entries(
    config.singletons || {}
  )
    .filter(([key]) => key !== standalonePageSingletonKey)
    .map(([key, singleton]) => ({
      key: `edit-${key}`,
      label: `Edit ${singleton.label}`,
      icon: settingsIcon,
      href: `${basePath}/singleton/${encodeURIComponent(key)}`,
    }));

  const handleAction = (key: Key) => {
    const action = [
      ...pageActions,
      ...collectionActions,
      ...singletonActions,
    ].find(action => action.key === key);
    if (action?.href) {
      router.push(action.href);
    } else if (action?.onAction) {
      action.onAction();
    }
  };

  const sections = [
    pageActions.length
      ? { key: 'pages', title: 'Pages', actions: pageActions }
      : null,
    collectionActions.length
      ? { key: 'collections', title: 'Collections', actions: collectionActions }
      : null,
    singletonActions.length
      ? { key: 'singletons', title: 'Singletons', actions: singletonActions }
      : null,
  ].filter(Boolean) as {
    key: string;
    title: string;
    actions: QuickAction[];
  }[];

  if (!sections.length) {
    return null;
  }

  return (
    <MenuTrigger>
      <ActionButton>
        <Icon src={plusIcon} />
        <Text>Create</Text>
        <Icon src={chevronDownIcon} />
      </ActionButton>
      <Menu onAction={handleAction}>
        {sections.map(section => (
          <Section key={section.key} title={section.title}>
            {section.actions.map(action => (
              <Item key={action.key} textValue={action.label}>
                <Icon src={action.icon} />
                <Text>{action.label}</Text>
              </Item>
            ))}
          </Section>
        ))}
      </Menu>
    </MenuTrigger>
  );
}

export function QuickActionsCompact() {
  const config = useConfig();
  const { basePath } = useAppState();
  const router = useRouter();
  const standalonePages = useStandalonePages(basePath);
  const standalonePageKeys = standalonePages.collections.map(
    collection => collection.key
  );
  const contentCollections = Object.entries(config.collections || {}).filter(
    ([key]) =>
      !standalonePages.collections.some(
        collection =>
          collection.sourceKind === 'collection' && collection.key === key
      )
  );

  if (standalonePageKeys.length === 1 && contentCollections.length === 0) {
    const key = standalonePageKeys[0];
    return (
      <Button
        onPress={() =>
          router.push(getCreateHref(config, basePath, key, 'standalone-page'))
        }
      >
        <Icon src={filePlusIcon} />
        <Text>New page</Text>
      </Button>
    );
  }

  if (contentCollections.length === 1 && standalonePageKeys.length === 0) {
    const [key, collection] = contentCollections[0];
    return (
      <Button
        onPress={() =>
          router.push(getCreateHref(config, basePath, key, 'collection'))
        }
      >
        <Icon src={plusIcon} />
        <Text>New {collection.label}</Text>
      </Button>
    );
  }

  const actions = [
    ...standalonePageKeys.map(key => ({
      key,
      label:
        standalonePageKeys.length === 1
          ? 'New page'
          : `New ${
              standalonePages.collections
                .find(collection => collection.key === key)
                ?.label.replace(/s$/i, '') ?? 'page'
            }`,
      routeKind: 'standalone-page' as const,
    })),
    ...contentCollections.map(([key, collection]) => ({
      key,
      label: `New ${collection.label}`,
      routeKind: 'collection' as const,
    })),
  ];

  if (!actions.length) {
    return null;
  }

  return (
    <MenuTrigger>
      <Button>
        <Icon src={plusIcon} />
        <Text>Create New</Text>
        <Icon src={chevronDownIcon} />
      </Button>
      <Menu
        onAction={key => {
          const action = actions.find(action => action.key === key);
          if (!action) {
            return;
          }
          router.push(
            getCreateHref(config, basePath, action.key, action.routeKind)
          );
        }}
      >
        {actions.map(action => (
          <Item key={action.key} textValue={action.label}>
            <Text>{action.label}</Text>
          </Item>
        ))}
      </Menu>
    </MenuTrigger>
  );
}

function getCreateHref(
  config: ReturnType<typeof useConfig>,
  basePath: string,
  key: string,
  routeKind: 'collection' | 'standalone-page'
) {
  return routeKind === 'standalone-page'
    ? getStandalonePageCreatePath(config, basePath, key)
    : `${basePath}/collection/${encodeURIComponent(key)}/create`;
}
