import getChangesets from '@changesets/read';
import fs from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import prettier from 'prettier';

const cwd = dirname(dirname(fileURLToPath(import.meta.url)));

const changesets: Awaited<ReturnType<typeof getChangesets>> = await (
  getChangesets as any
).default(cwd);
const prettierConfig = await prettier.resolveConfig(cwd);

for (const changeset of changesets) {
  let didUpdate = false;
  const newReleases = changeset.releases.flatMap(release => {
    if (!release.name.startsWith('@voussoir/')) {
      return release;
    }
    if (didUpdate) {
      return [];
    }
    didUpdate = true;
    return { name: '@keystar/ui', type: release.type };
  });

  if (didUpdate) {
    const changesetContents = `---
  ${newReleases.map(release => `"${release.name}": ${release.type}`).join('\n')}
---
${changeset.summary}
`;
    await fs.writeFile(
      `${cwd}/.changeset/${changeset.id}.md`,
      prettier.format(changesetContents, {
        ...prettierConfig,
        filepath: `${cwd}/.changeset/${changeset.id}.md`,
      })
    );
  }
}
