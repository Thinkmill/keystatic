import fs from 'node:fs/promises';

const localesDir = new URL('../src/app/l10n/', import.meta.url);

const entries = await fs.readdir(localesDir, { withFileTypes: true });
const localeDirectories = entries
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

if (localeDirectories.length === 0) {
  throw new Error(`No locale directories found in ${localesDir.pathname}`);
}

const localeData = new Map();

for (const locale of localeDirectories) {
  const localeUrl = new URL(`${locale}/`, localesDir);
  const keyEntries = (await fs.readdir(localeUrl, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
  const translations = {};

  for (const key of keyEntries) {
    const sourcePath = new URL(`${key}/index.json`, localeUrl);
    const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));

    if (typeof source.value !== 'string' || source.value.length === 0) {
      throw new Error(
        `${sourcePath.pathname} must contain a non-empty string value`
      );
    }
    if (source.key !== key) {
      console.warn(
        `${sourcePath.pathname} declares key ${JSON.stringify(
          source.key
        )}; preserving directory key ${JSON.stringify(key)}`
      );
    }
    if (key in translations) {
      throw new Error(`Duplicate key ${JSON.stringify(key)} in ${locale}`);
    }

    translations[key] = source.value;
  }

  localeData.set(locale, translations);
}

const keySets = [...localeData.entries()].map(([locale, translations]) => [
  locale,
  Object.keys(translations).sort(),
]);
const expectedKeys = JSON.stringify(keySets[0][1]);
for (const [locale, keys] of keySets.slice(1)) {
  if (JSON.stringify(keys) !== expectedKeys) {
    throw new Error(
      `${locale} does not contain the same translation keys as ${keySets[0][0]}`
    );
  }
}

for (const [locale, translations] of localeData) {
  const outputPath = new URL(`${locale}.json`, localesDir);
  await fs.writeFile(outputPath, `${JSON.stringify(translations, null, 2)}\n`);
}

for (const locale of localeDirectories) {
  await fs.rm(new URL(`${locale}/`, localesDir), { recursive: true });
}

console.log(
  `Migrated ${localeDirectories.length} locales with ${keySets[0][1].length} keys each.`
);
