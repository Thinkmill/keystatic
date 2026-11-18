import { expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  LocalizedStringDictionary,
  LocalizedStringFormatter,
} from '@internationalized/string';
import l10nMessages from '.';
import defaultLocaleStrings from './default-locale';
import { defaultStringFormatter } from './default-formatter';
import enUS from './en-US.json';
import { pluralize } from '../pluralize';

const formatterFor = (locale: string) =>
  new LocalizedStringFormatter(
    locale,
    new LocalizedStringDictionary(l10nMessages)
  );

test('locales fall back to en-US for keys they do not have', () => {
  const dir = path.dirname(new URL(import.meta.url).pathname);
  let fallbacks = 0;
  for (const locale of Object.keys(l10nMessages)) {
    const own: Record<string, string> = JSON.parse(
      fs.readFileSync(path.join(dir, `${locale}.json`), 'utf8')
    );
    expect(Object.keys(l10nMessages[locale]).sort()).toEqual(
      Object.keys(defaultLocaleStrings).sort()
    );
    const formatter = formatterFor(locale);
    for (const key of Object.keys(enUS) as (keyof typeof enUS)[]) {
      if (key in own) continue;
      fallbacks++;
      // plural rules differ between locales, the English text must not
      for (const count of [0, 1, 2, 5, 21, 101, 1000]) {
        expect(formatter.format(key, { count })).toBe(
          defaultStringFormatter.format(key, { count })
        );
      }
    }
  }
  expect(fallbacks).toBeGreaterThan(0);
});

test('en-US strings without arguments are unchanged by compilation', () => {
  for (const [key, value] of Object.entries(enUS)) {
    if (value.includes('{')) continue;
    expect(defaultStringFormatter.format(key as keyof typeof enUS), key).toBe(
      value
    );
  }
});

test('counts read the same as before they were localized', () => {
  for (const count of [0, 1, 2, 21, 1000]) {
    expect(defaultStringFormatter.format('entryCount', { count })).toBe(
      pluralize(count, { singular: 'entry', plural: 'entries' })
    );
    expect(
      defaultStringFormatter.format('changesWithoutCount', { count })
    ).toBe(pluralize(count, { singular: 'change', inclusive: false }));
  }
});
