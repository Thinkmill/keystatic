import { useLocalizedStringFormatter } from '@react-aria/i18n';

import { Config, NAVIGATION_DIVIDER_KEY } from '../config';

import l10nMessages from './l10n/index.json';
import { useAppState, useConfig } from './shell/context';
import { useChanged } from './shell/data';

type ItemData = {
  key: string;
  href: string;
  label: string;
  changed: number | boolean;
  entryCount?: number;
  children?: undefined;
  isDivider?: undefined;
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
      children: Item[];
    };

export function useNavItems(): ItemOrGroup[] {
  let { basePath } = useAppState();
  let config = useConfig();
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  let changeMap = useChanged();

  const collectionKeys = Object.keys(config.collections || {});
  const singletonKeys = Object.keys(config.singletons || {});
  const items = config.ui?.navigation || {
    ...(!!collectionKeys.length && {
      [stringFormatter.format('collections')]: collectionKeys,
    }),
    ...(!!singletonKeys.length && {
      [stringFormatter.format('singletons')]: singletonKeys,
    }),
  };
  const options = { basePath, changeMap, config };

  if (Array.isArray(items)) {
    return items.map(key => populateItemData(key, options));
  }

  return Object.entries(items).map(([section, keys]) => ({
    title: section,
    children: keys.map(key => populateItemData(key, options)),
  }));
}

function populateItemData(
  key: string,
  options: {
    basePath: string;
    changeMap: ReturnType<typeof useChanged>;
    config: Config;
  }
): Item {
  let { basePath, changeMap, config } = options;

  // divider
  if (key === NAVIGATION_DIVIDER_KEY) {
    return { isDivider: true };
  }

  // collection
  if (config.collections && key in config.collections) {
    const href = `${basePath}/collection/${encodeURIComponent(key)}`;
    const changes = changeMap.collections.get(key);
    const changed = changes
      ? changes.changed.size + changes.added.size + changes.removed.size
      : 0;

    const label = config.collections[key].label;

    return { key, href, label, changed, entryCount: changes?.totalCount };
  }

  // singleton
  if (config.singletons && key in config.singletons) {
    const href = `${basePath}/singleton/${encodeURIComponent(key)}`;
    const changed = changeMap.singletons.has(key);
    const label = config.singletons[key].label;

    return { key, href, label, changed };
  }

  throw new Error(`Unknown navigation key: "${key}".`);
}
