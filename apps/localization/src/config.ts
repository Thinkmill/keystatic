import { collection, config, fields } from '@keystatic/core';

const locales = {
  'ar-AE': 'Arabic (UAE) 🇦🇪',
  'bg-BG': 'Bulgarian (Bulgaria) 🇧🇬',
  'cs-CZ': 'Czech (Czech Republic) 🇨🇿',
  'da-DK': 'Danish (Denmark) 🇩🇰',
  'de-DE': 'German (Germany) 🇩🇪',
  'el-GR': 'Greek (Greece) 🇬🇷',
  'en-US': 'English (United States) 🇺🇸',
  'es-ES': 'Spanish (Spain) 🇪🇸',
  'et-EE': 'Estonian (Estonia) 🇪🇪',
  'fi-FI': 'Finnish (Finland) 🇫🇮',
  'fr-FR': 'French (France) 🇫🇷',
  'he-IL': 'Hebrew (Israel) 🇮🇱',
  'hr-HR': 'Croatian (Croatia) 🇭🇷',
  'hu-HU': 'Hungarian (Hungary) 🇭🇺',
  'it-IT': 'Italian (Italy) 🇮🇹',
  'ja-JP': 'Japanese (Japan) 🇯🇵',
  'ko-KR': 'Korean (Korea) 🇰🇷',
  'lt-LT': 'Lithuanian (Lithuania) 🇱🇹',
  'lv-LV': 'Latvian (Latvia) 🇱🇻',
  'nb-NO': 'Norwegian (Norway) 🇳🇴',
  'nl-NL': 'Dutch (Netherlands) 🇳🇱',
  'pl-PL': 'Polish (Poland) 🇵🇱',
  'pt-BR': 'Portuguese (Brazil) 🇧🇷',
  'pt-PT': 'Portuguese (Portugal) 🇵🇹',
  'ro-RO': 'Romanian (Romania) 🇷🇴',
  'ru-RU': 'Russian (Russia) 🇷🇺',
  'sk-SK': 'Slovak (Slovakia) 🇸🇰',
  'sl-SI': 'Slovenian (Slovenia) 🇸🇮',
  'sr-SP': 'Serbian (Serbia) 🇷🇸',
  'sv-SE': 'Swedish (Sweden) 🇸🇪',
  'tr-TR': 'Turkish (Turkey) 🇹🇷',
  'uk-UA': 'Ukrainian (Ukraine) 🇺🇦',
  'zh-CN': 'Chinese (Simplified) 🇨🇳',
  'zh-TW': 'Chinese (Traditional) 🇨🇳',
};

const localeCollections = Object.fromEntries(
  Object.entries(locales).map(([key, label]) => [
    key,
    collection({
      directory: `packages/keystatic/app/l10n/${key}`,
      format: 'json',
      label,
      getItemSlug: data => data.key,
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
          ] as const,
          defaultValue: 'global',
        }),
      },
    }),
  ])
);

export default config({
  storage: {
    kind: 'github',
    repo: { name: 'keystatic', owner: 'thinkmill' },
  },
  collections: {
    ...localeCollections,
  },
});
