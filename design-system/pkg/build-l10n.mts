import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { compileString } from '@internationalized/string-compiler';

const src = path.resolve(fileURLToPath(import.meta.url), '../src');

for (const file of await fs.readdir(src)) {
  const filePath = path.resolve(src, file, 'l10n.json');
  let l10nFileContents;
  try {
    l10nFileContents = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    if ((err as any).code === 'ENOENT' || (err as any).code === 'ENOTDIR') {
      continue;
    }
    throw err;
  }
  const l10n: Record<string, Record<string, string>> = JSON.parse(
    l10nFileContents
  );
  let out = 'const localizedMessages = {\n';
  for (const [lang, translations] of Object.entries(l10n)) {
    out += `  ${JSON.stringify(lang)}: {\n`;
    for (const [key, value] of Object.entries(translations)) {
      out += `    ${JSON.stringify(key)}: ${compileString(value)},\n`;
    }
    out += '  },\n';
  }
  out += '};\n';
  out += 'export default localizedMessages;\n';
  const withoutExtension = filePath.replace(/\.json$/, '');
  await fs.writeFile(withoutExtension + '.js', out);
  await fs.writeFile(
    withoutExtension + '.d.ts',
    `declare const localizedMessages: Record<string, Record<string, import('@internationalized/string').LocalizedString>>;
export default localizedMessages;
`
  );
  console.log(`Wrote ${withoutExtension}`);
}
