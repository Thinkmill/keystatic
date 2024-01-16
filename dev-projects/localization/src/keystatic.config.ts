import { collection, config, fields } from '@keystatic/core';
import { locales } from '../../../packages/keystatic/src/app/l10n/locales';

const localeCollections = Object.fromEntries(
  Object.entries(locales).map(([key, label]) => [
    key,
    collection({
      path: `packages/keystatic/src/app/l10n/${key}/*/`,
      format: 'json',
      label,
      slugField: 'key',
      schema: {
        key: fields.text({
          label: 'Key',
          description:
            'The key should be "camelCase" in english, and contain no special characters.',
          validation: { length: { min: 1 } },
        }),
        value: fields.text({
          label: 'Value',
          validation: { length: { min: 1 } },
        }),
        notes: fields.text({ label: 'Notes', multiline: true }),
        type: fields.select({
          label: 'Type',
          options: [
            { value: 'global', label: 'Global' },
            { value: 'git-related', label: 'Git related' },
            { value: 'dashboard', label: 'Dashboard' },
            { value: 'collection-list', label: 'Collection list' },
            { value: 'collection-item', label: 'Collection item' },
            { value: 'singleton', label: 'Singleton' },
            { value: 'auth', label: 'Authentication' },
          ],
          defaultValue: 'global',
        }),
      },
    }),
  ])
);

export default config({
  // storage: {
  //   kind: 'github',
  //   repo: { name: 'keystatic', owner: 'thinkmill' },
  // },
  storage: { kind: 'local' },
  collections: {
    ...localeCollections,
  },
});
