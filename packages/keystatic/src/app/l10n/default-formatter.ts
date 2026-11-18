import {
  LocalizedString,
  LocalizedStringDictionary,
  LocalizedStringFormatter,
} from '@internationalized/string';
import defaultLocaleStrings, { LocalizedMessageKey } from './default-locale';

export type KeystaticStringFormatter = LocalizedStringFormatter<
  LocalizedMessageKey,
  LocalizedString
>;

// for messages created outside of the Admin UI's locale (e.g. field validation
// in the reader), without including every locale
export const defaultStringFormatter: KeystaticStringFormatter =
  new LocalizedStringFormatter(
    'en-US',
    new LocalizedStringDictionary({ 'en-US': defaultLocaleStrings })
  );
