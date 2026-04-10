import { useLocalizedStringFormatter } from '@react-aria/i18n';

import { Config, NAVIGATION_DIVIDER_KEY } from '../config';

import l10nMessages from './l10n';
import { useAppState, useConfig } from './shell/context';
import { useChanged } from './shell/data';
import {
  getStandalonePageCreatePath,
  useStandalonePages,
} from './standalone-pages';

type ItemKind = 'action' | 'collection' | 'page' | 'singleton';

type ItemData = {
  changed: number | boolean;
  entryCount?: number;
  href: string;
  isDivider?: undefined;
  itemKind: ItemKind;
  key: string;
  label: string;
  children?: undefined;
};
export type ItemDivider = {
  key?: undefined;
  children?: undefined;
  isDivider: true;
};
export type Item = ItemData | ItemDivider;
export type ItemOrGroup =
  | Item
  | {
      key?: undefined;
      isDivider?: undefined;
      title: string;
      createHref?: string;
      children: Item[];
    };

export function useNavItems(): ItemOrGroup[] {
  const { basePath } = useAppState();
  const config = useConfig();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const changeMap = useChanged();
  const standalonePages = useStandalonePages(basePath);
  const standalonePageSingletonKey = standalonePages.singleton?.key;
  const standalonePageCreateHref =
    standalonePageSingletonKey && standalonePages.collections.length
      ? getStandalonePageCreatePath(
          config,
          basePath,
          standalonePageSingletonKey
        )
      : undefined;

  const standalonePageKeys = new Set(
    standalonePages.collections.map(collection => collection.key)
  );
  const collectionKeys = Object.keys(config.collections || {});
  const contentCollectionKeys = collectionKeys.filter(
    key => !standalonePageKeys.has(key)
  );
  const singletonKeys = Object.keys(config.singletons || {}).filter(
    key => key !== standalonePageSingletonKey
  );

  if (config.ui?.navigation) {
    const options = {
      basePath,
      changeMap,
      config,
      standalonePageCreateHref,
      standalonePageSingletonKey,
    };
    if (Array.isArray(config.ui.navigation)) {
      return config.ui.navigation.map(key => populateItemData(key, options));
    }
    return Object.entries(config.ui.navigation).map(([section, keys]) => ({
      title: section,
      children: keys.map(key => populateItemData(key, options)),
    }));
  }

  const pageCreateHref =
    standalonePages.collections.length === 1
      ? standalonePages.collections[0].createHref
      : undefined;

  const pageChildren =
    standalonePages.items.length > 0
      ? standalonePages.items.map(item => ({
          changed: item.changed,
          href: item.href,
          itemKind: 'page' as const,
          key: item.id,
          label: item.label,
        }))
      : standalonePages.isLoading
      ? []
      : pageCreateHref
      ? [
          {
            changed: false,
            href: pageCreateHref,
            itemKind: 'action' as const,
            key: 'create-standalone-page',
            label: 'Create page',
          },
        ]
      : [];

  const sections: ItemOrGroup[] = [];

  if (standalonePages.collections.length) {
    sections.push({
      title: 'Pages',
      createHref: pageCreateHref,
      children: pageChildren,
    });
  }

  if (contentCollectionKeys.length) {
    sections.push({
      title: stringFormatter.format('collections'),
      children: contentCollectionKeys.map(key =>
        populateItemData(key, { basePath, changeMap, config })
      ),
    });
  }

  if (singletonKeys.length) {
    sections.push({
      title: stringFormatter.format('singletons'),
      children: singletonKeys.map(key =>
        populateItemData(key, { basePath, changeMap, config })
      ),
    });
  }

  return sections;
}

function populateItemData(
  key: string,
  options: {
    basePath: string;
    changeMap: ReturnType<typeof useChanged>;
    config: Config;
    standalonePageCreateHref?: string;
    standalonePageSingletonKey?: string;
  }
): Item {
  const {
    basePath,
    changeMap,
    config,
    standalonePageCreateHref,
    standalonePageSingletonKey,
  } = options;

  if (key === NAVIGATION_DIVIDER_KEY) {
    return { isDivider: true };
  }

  if (config.collections && key in config.collections) {
    const href = `${basePath}/collection/${encodeURIComponent(key)}`;
    const changes = changeMap.collections.get(key);
    const changed = changes
      ? changes.changed.size + changes.added.size + changes.removed.size
      : 0;

    return {
      changed,
      entryCount: changes?.totalCount,
      href,
      itemKind: 'collection',
      key,
      label: config.collections[key].label,
    };
  }

  if (config.singletons && key in config.singletons) {
    if (key === standalonePageSingletonKey && standalonePageCreateHref) {
      return {
        changed: changeMap.singletons.has(key),
        href: standalonePageCreateHref,
        itemKind: 'action',
        key: `${key}-create-page`,
        label: 'Create page',
      };
    }
    return {
      changed: changeMap.singletons.has(key),
      href: `${basePath}/singleton/${encodeURIComponent(key)}`,
      itemKind: 'singleton',
      key,
      label: config.singletons[key].label,
    };
  }

  throw new Error(`Unknown navigation key: "${key}".`);
}
