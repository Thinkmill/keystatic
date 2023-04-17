import fs from 'fs/promises';
import path from 'path';

const localesDir = path.join(__dirname, '../src/app/l10n');
(async () => {
  const locales: Record<string, Record<string, string>> = {};
  await Promise.all(
    (
      await fs.readdir(localesDir, { withFileTypes: true })
    ).map(async localeEntry => {
      if (!localeEntry.isDirectory()) return;
      const localeDir = path.join(localesDir, localeEntry.name);
      const entries: Record<string, string> = {};
      await Promise.all(
        (
          await fs.readdir(localeDir, { withFileTypes: true })
        ).map(async entry => {
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
        })
      );
      if (Object.keys(entries).length) {
        locales[localeEntry.name] = entries;
      }
    })
  );
  await fs.writeFile(
    path.join(localesDir, 'index.json'),
    JSON.stringify(locales, null, 2) + '\n' // carriage return to make prettier happy
  );
})();
