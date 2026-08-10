import fs from 'fs/promises';
import path from 'path';
import { compileString } from '@internationalized/string-compiler';

const localesDir = 'src/app/l10n';
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
  let out = 'const strings = {\n';
  for (const [lang, translations] of Object.entries(locales)) {
    out += `  ${JSON.stringify(lang)}: {\n`;
    for (const [key, value] of Object.entries(translations).sort(([a], [b]) =>
      a.localeCompare(b)
    )) {
      out += `    ${JSON.stringify(key)}: ${compileString(value)},\n`;
    }
    out += '  },\n';
  }
  out += '};\n';
  out += 'export default strings;\n';

  await fs.writeFile(path.join(localesDir, 'index.js'), out);
  await fs.writeFile(
    path.join(localesDir, 'index.d.ts'),
    `declare const l10nMessages: Record<string, Record<string, import('@internationalized/string').LocalizedString>>;
export default l10nMessages;
`
  );
})();
