import fs from 'fs/promises';
import path from 'path';
import { compileString } from '@internationalized/string-compiler';

const localesDir = 'src/app/l10n';
const defaultLocale = 'en-US';

function compileTranslations(translations: Record<string, string>) {
  let out = '';
  for (const [key, value] of Object.entries(translations).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    out += `    ${JSON.stringify(key)}: ${compileString(value)},\n`;
  }
  return out;
}

(async () => {
  const locales: Record<string, Record<string, string>> = {};
  for (const entry of (
    await fs.readdir(localesDir, { withFileTypes: true })
  ).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const locale = path.basename(entry.name, '.json');
    const translations = JSON.parse(
      await fs.readFile(path.join(localesDir, entry.name), 'utf-8')
    );
    if (
      !translations ||
      typeof translations !== 'object' ||
      Array.isArray(translations)
    ) {
      throw new Error(
        `${entry.name} must contain an object of translation values`
      );
    }
    locales[locale] = translations;
  }
  const defaultTranslations = locales[defaultLocale];

  // the default locale is in its own module so that code that also runs
  // outside of the Admin UI (e.g. field validation in the reader) can use it
  // without including every locale
  await fs.writeFile(
    path.join(localesDir, 'default-locale.js'),
    `const defaultLocaleStrings = {\n${compileTranslations(
      defaultTranslations
    )}};\nexport default defaultLocaleStrings;\n`
  );
  const keyType = Object.keys(defaultTranslations)
    .sort((a, b) => a.localeCompare(b))
    .map(key => `\n  | ${JSON.stringify(key)}`)
    .join('');
  await fs.writeFile(
    path.join(localesDir, 'default-locale.d.ts'),
    `export type LocalizedMessageKey =${keyType};
declare const defaultLocaleStrings: Record<LocalizedMessageKey, import('@internationalized/string').LocalizedString>;
export default defaultLocaleStrings;
`
  );

  // every locale falls back to the default locale for keys it doesn't have
  let out = `import defaultLocaleStrings from './default-locale.js';\n\nconst strings = {\n`;
  for (const [lang, translations] of Object.entries(locales)) {
    out += `  ${JSON.stringify(lang)}: `;
    out +=
      lang === defaultLocale
        ? 'defaultLocaleStrings,\n'
        : `{\n    ...defaultLocaleStrings,\n${compileTranslations(
            translations
          )}  },\n`;
  }
  out += '};\n';
  out += 'export default strings;\n';

  await fs.writeFile(path.join(localesDir, 'index.js'), out);
  await fs.writeFile(
    path.join(localesDir, 'index.d.ts'),
    `declare const l10nMessages: Record<string, Record<import('./default-locale').LocalizedMessageKey, import('@internationalized/string').LocalizedString>>;
export default l10nMessages;
`
  );
})();
