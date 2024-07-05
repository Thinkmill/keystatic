import { toastQueue } from '@keystar/ui/toast';
import { Text } from '@keystar/ui/typography';
import { useLocale } from '@react-aria/i18n';
import { UseStore, clear, createStore, del, get, set } from 'idb-keyval';
import { useState, useMemo } from 'react';

const units = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 7,
  weeks: 4,
  months: 12,
  years: Infinity,
};

function formatTimeAgo(
  targetDate: Date,
  currentDate: Date,
  formatter: Intl.RelativeTimeFormat
) {
  let duration = (targetDate.getTime() - currentDate.getTime()) / 1000;

  for (const [name, amount] of Object.entries(units) as [
    keyof typeof units,
    number,
  ][]) {
    if (Math.abs(duration) < amount) {
      return formatter.format(Math.round(duration), name);
    }
    duration /= amount;
  }
  return 'unknown';
}

function RelativeTime(props: { date: Date }) {
  const { locale } = useLocale();
  const [now] = useState(() => new Date());
  const formatted = useMemo(() => {
    const formatter = new Intl.RelativeTimeFormat(locale);
    formatter.format(props.date.getTime() - now.getTime(), 'second');
    return formatTimeAgo(props.date, now, formatter);
  }, [locale, now, props.date]);
  return <time dateTime={props.date.toISOString()}>{formatted}</time>;
}

export function showDraftRestoredToast(
  savedAt: Date,
  hasChangedSince: boolean
) {
  toastQueue.info(
    <Text>
      Restored draft from <RelativeTime date={savedAt} />.{' '}
      {hasChangedSince && (
        <Text color="accent">
          Other changes have been made to this entry since the draft. You may
          want to discard the draft changes.
        </Text>
      )}
    </Text>,
    { timeout: 8000 }
  );
}

let store: UseStore;

function getStore() {
  if (!store) {
    store = createStore('keystatic', 'items');
  }
  return store;
}

type Key =
  | readonly [kind: 'collection', collection: string, slug: string]
  | readonly [
      kind: 'collection-create',
      collection: string,
      duplicateSlug?: string,
    ]
  | readonly [kind: 'singleton', singleton: string];

// the as anys are because the indexeddb types dont't accept readonly arrays

export function setDraft(key: Key, val: unknown) {
  return set(key as any, val, getStore());
}

export function delDraft(key: Key) {
  return del(key as any, getStore());
}

export function getDraft(key: Key): Promise<unknown> {
  return get(key as any, getStore());
}

export async function clearDrafts() {
  await clear(getStore());
}
