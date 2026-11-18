import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';
import { Fragment, ReactNode } from 'react';

import l10nMessages from '../l10n';
import type { KeystaticStringFormatter } from '../l10n/default-formatter';
import type { LocalizedMessageKey } from '../l10n/default-locale';

export function useLocalizedString() {
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return stringFormatter;
}

const marker = '\u0000';

/**
 * Formats a message where some variables are elements, e.g. a link in the
 * middle of a sentence.
 */
export function formatWithElements(
  stringFormatter: KeystaticStringFormatter,
  key: LocalizedMessageKey,
  elements: Record<string, ReactNode>
): ReactNode {
  const names = Object.keys(elements);
  const message = stringFormatter.format(
    key,
    Object.fromEntries(names.map((name, i) => [name, marker + i + marker]))
  );
  return message
    .split(marker)
    .map((part, i) =>
      i % 2 === 0 ? part : <Fragment key={i}>{elements[names[+part]]}</Fragment>
    );
}

/** Renders a message, for elements that are created outside of a component. */
export function LocalizedText(props: {
  id: LocalizedMessageKey;
  args?: Record<string, string | number>;
}) {
  return <>{useLocalizedString().format(props.id, props.args)}</>;
}
