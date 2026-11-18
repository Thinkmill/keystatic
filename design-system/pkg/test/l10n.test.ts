import { expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../src'
);

test('every locale falls back to en-US for keys it does not have', async () => {
  for (const component of fs.readdirSync(src)) {
    const jsonPath = path.join(src, component, 'l10n.json');
    if (!fs.existsSync(jsonPath)) continue;
    const { default: messages } = await import(
      path.join(src, component, 'l10n.js')
    );
    const defaultKeys = Object.keys(messages['en-US']).sort();
    for (const locale of Object.keys(messages)) {
      expect(
        Object.keys(messages[locale]).sort(),
        `${component} ${locale}`
      ).toEqual(defaultKeys);
    }
  }
});
