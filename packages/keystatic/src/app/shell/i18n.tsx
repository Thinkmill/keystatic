import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';

import l10nMessages from '../l10n';

export function useLocalizedString() {
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return stringFormatter;
}
