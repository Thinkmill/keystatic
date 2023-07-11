// Note: the keys from this object are used by the config type, but the locale
// names aren't used directly in Keystatic, they're just here to document the
// ones we support.

// The locales object is also used by `/dev-projects/localization` to generate config
// for managing locale translations in Keystatic itself (!!)

export const locales = {
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

export type Locale = keyof typeof locales;
