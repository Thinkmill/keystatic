import fs from 'fs/promises';
import path from 'path';
import { compileString } from '@internationalized/string-compiler';

const localesDir = 'src/app/l10n';
(async () => {
  const locales: Record<string, Record<string, string>> = {};
  await Promise.all(
    (await fs.readdir(localesDir, { withFileTypes: true })).map(
      async localeEntry => {
        if (!localeEntry.isDirectory()) return;
        const localeDir = path.join(localesDir, localeEntry.name);
        const entries: Record<string, string> = {};
        await Promise.all(
          (await fs.readdir(localeDir, { withFileTypes: true })).map(
            async entry => {
              if (!entry.isDirectory()) return;
              let json;
              try {
                json = JSON.parse(
                  await fs.readFile(
                    path.join(localeDir, entry.name, 'index.json'),
                    'utf-8'
                  )
                );
              } catch (err) {
                if ((err as any).code === 'ENOENT') {
                  return;
                }
                throw err;
              }
              entries[entry.name] = json.value;
            }
          )
        );
        if (Object.keys(entries).length) {
          locales[localeEntry.name] = entries;
        }
      }
    )
  );
  let out = 'const strings = {\n';
  for (const [lang, translations] of Object.entries(locales)) {
    out += `  ${JSON.stringify(lang)}: {\n`;
    for (const [key, value] of Object.entries(translations)) {
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
