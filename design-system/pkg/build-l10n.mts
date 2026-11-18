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
  const defaultStrings = l10n['en-US'];
  const compile = (translations: Record<string, string>) => {
    let out = '';
    for (const [key, value] of Object.entries(translations)) {
      out += `    ${JSON.stringify(key)}: ${compileString(value)},\n`;
    }
    return out;
  };
  // every locale falls back to en-US for keys it doesn't have
  let out = `const defaultStrings = {\n${compile(defaultStrings)}};\n\n`;
  out += 'const localizedMessages = {\n';
  for (const [lang, translations] of Object.entries(l10n)) {
    out += `  ${JSON.stringify(lang)}: `;
    out +=
      lang === 'en-US'
        ? 'defaultStrings,\n'
        : `{\n    ...defaultStrings,\n${compile(translations)}  },\n`;
  }
  out += '};\n';
  out += 'export default localizedMessages;\n';
  const withoutExtension = filePath.replace(/\.json$/, '');
  await fs.writeFile(withoutExtension + '.js', out);
  await fs.writeFile(
    withoutExtension + '.d.ts',
    `declare const localizedMessages: Record<string, Record<${Object.keys(
      defaultStrings
    )
      .map(key => JSON.stringify(key))
      .join(' | ')}, import('@internationalized/string').LocalizedString>>;
export default localizedMessages;
`
  );
  console.log(`Wrote ${withoutExtension}`);
}
