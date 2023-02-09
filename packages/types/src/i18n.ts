/** Indicates the directionality of text. */
export type Direction = 'ltr' | 'rtl';

/** Not a thorough list, but covers common cases. */
export type LocaleCode =
  // ---
  | 'fr-FR' // French (France)
  | 'fr-CA' // French (Canada)
  | 'de-DE' // German (Germany)
  | 'en-GB' // English (Great Britain)
  | 'en-US' // English (United States)
  | 'ja-JP' // Japanese (Japan)
  // ---
  | 'da-DK' // Danish (Denmark)
  | 'nl-NL' // Dutch (Netherlands)
  | 'fi-FI' // Finnish (Finland)
  | 'it-IT' // Italian (Italy)
  | 'nb-NO' // Norwegian (Norway)
  | 'es-ES' // Spanish (Spain)
  | 'sv-SE' // Swedish (Sweden)
  | 'pt-BR' // Portuguese (Brazil)
  // ---
  | 'zh-CN' // Chinese (Simplified)
  | 'zh-TW' // Chinese (Traditional)
  | 'ko-KR' // Korean (Korea)
  // ---
  | 'bg-BG' // Bulgarian (Bulgaria)
  | 'hr-HR' // Croatian (Croatia)
  | 'cs-CZ' // Czech (Czech Republic)
  | 'et-EE' // Estonian (Estonia)
  | 'hu-HU' // Hungarian (Hungary)
  | 'lv-LV' // Latvian (Latvia)
  | 'lt-LT' // Lithuanian (Lithuania)
  | 'pl-PL' // Polish (Poland)
  | 'ro-RO' // Romanian (Romania)
  | 'ru-RU' // Russian (Russia)
  | 'sr-SP' // Serbian (Serbia)
  | 'sk-SK' // Slovakian (Slovakia)
  | 'sl-SI' // Slovenian (Slovenia)
  | 'tr-TR' // Turkish (Turkey)
  | 'uk-UA' // Ukrainian (Ukraine)
  // ---
  | 'ar-AE' // Arabic (United Arab Emirates)
  | 'el-GR' // Greek (Greece)
  | 'he-IL' // Hebrew (Israel)

  // Allow autocomplete to work properly, and not collapse the above options into just `string`.
  // See https://github.com/microsoft/TypeScript/issues/29729.
  | (string & {});
