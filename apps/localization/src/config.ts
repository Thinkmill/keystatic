import { collection, config, fields } from 'keystatic';

const locales = fields.object({
  'ar-AE': fields.text({ label: 'Arabic (United Arab Emirates) 🇦🇪' }),
  'bg-BG': fields.text({ label: 'Bulgarian (Bulgaria) 🇧🇬' }),
  'cs-CZ': fields.text({ label: 'Czech (Czech Republic) 🇨🇿' }),
  'da-DK': fields.text({ label: 'Danish (Denmark) 🇩🇰' }),
  'de-DE': fields.text({ label: 'German (Germany) 🇩🇪' }),
  'el-GR': fields.text({ label: 'Greek (Greece) 🇬🇷' }),
  'en-US': fields.text({ label: 'English (United States) 🇺🇸' }),
  'es-ES': fields.text({ label: 'Spanish (Spain) 🇪🇸' }),
  'et-EE': fields.text({ label: 'Estonian (Estonia) 🇪🇪' }),
  'fi-FI': fields.text({ label: 'Finnish (Finland) 🇫🇮' }),
  'fr-FR': fields.text({ label: 'French (France) 🇫🇷' }),
  'he-IL': fields.text({ label: 'Hebrew (Israel) 🇮🇱' }),
  'hr-HR': fields.text({ label: 'Croatian (Croatia) 🇭🇷' }),
  'hu-HU': fields.text({ label: 'Hungarian (Hungary) 🇭🇺' }),
  'it-IT': fields.text({ label: 'Italian (Italy) 🇮🇹' }),
  'ja-JP': fields.text({ label: 'Japanese (Japan) 🇯🇵' }),
  'ko-KR': fields.text({ label: 'Korean (Korea) 🇰🇷' }),
  'lt-LT': fields.text({ label: 'Lithuanian (Lithuania) 🇱🇹' }),
  'lv-LV': fields.text({ label: 'Latvian (Latvia) 🇱🇻' }),
  'nb-NO': fields.text({ label: 'Norwegian (Norway) 🇳🇴' }),
  'nl-NL': fields.text({ label: 'Dutch (Netherlands) 🇳🇱' }),
  'pl-PL': fields.text({ label: 'Polish (Poland) 🇵🇱' }),
  'pt-BR': fields.text({ label: 'Portuguese (Brazil) 🇧🇷' }),
  'pt-PT': fields.text({ label: 'Portuguese (Portugal) 🇵🇹' }),
  'ro-RO': fields.text({ label: 'Romanian (Romania) 🇷🇴' }),
  'ru-RU': fields.text({ label: 'Russian (Russia) 🇷🇺' }),
  'sk-SK': fields.text({ label: 'Slovakian (Slovakia) 🇸🇰' }),
  'sl-SI': fields.text({ label: 'Slovenian (Slovenia) 🇸🇮' }),
  'sr-SP': fields.text({ label: 'Serbian (Serbia) 🇷🇸' }),
  'sv-SE': fields.text({ label: 'Swedish (Sweden) 🇸🇪' }),
  'tr-TR': fields.text({ label: 'Turkish (Turkey) 🇹🇷' }),
  'uk-UA': fields.text({ label: 'Ukrainian (Ukraine) 🇺🇦' }),
  'zh-CN': fields.text({ label: 'Chinese (Simplified) 🇨🇳' }),
  'zh-TW': fields.text({ label: 'Chinese (Traditional) 🇨🇳' }),
});

export default config({
  storage: {
    kind: 'github',
    repo: { name: 'keystatic', owner: 'thinkmill' },
  },
  collections: {
    actions: collection({
      directory: 'keystatic/l10n/actions',
      format: 'json',
      label: 'Actions',
      getItemSlug: data => data.key,
      schema: {
        key: fields.text({ label: 'Key' }),
        locales,
      },
    }),
    git: collection({
      directory: 'keystatic/l10n/git',
      format: 'json',
      label: 'Git related',
      getItemSlug: data => data.key,
      schema: {
        key: fields.text({ label: 'Key' }),
        locales,
      },
    }),
  },
});
