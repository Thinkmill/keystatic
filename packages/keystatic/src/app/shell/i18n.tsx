import { useLocalizedStringFormatter } from '@react-aria/i18n';

import l10nMessages from '../l10n';

export function useLocalizedString() {
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return stringFormatter;
}
