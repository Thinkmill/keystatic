import path from 'path';
import fs from 'fs/promises';
import nonPromiseFs from 'fs';
import outdent from 'outdent';
import fastGlob from 'fast-glob';
import onExit from 'signal-exit';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { expect } from '@jest/globals';

export const js = outdent;
export const ts = outdent;
export const tsx = outdent;

type Fixture = {
  [key: string]: string | { kind: 'symlink'; path: string };
};

const tempDir = nonPromiseFs.realpathSync(tmpdir());

export async function testdir(dir: Fixture) {
  const temp = path.join(tempDir, randomUUID());
  onExit(() => {
    nonPromiseFs.rmSync(temp, { recursive: true, force: true });
  });
  await Promise.all(
    Object.keys(dir).map(async filename => {
      const output = dir[filename];
      const fullPath = path.join(temp, filename);
      const dirname = path.dirname(fullPath);
      await fs.mkdir(dirname, { recursive: true });
      if (typeof output === 'string') {
        await fs.writeFile(fullPath, output);
      } else {
        const targetPath = path.resolve(temp, output.path);
        await fs.symlink(targetPath, fullPath);
      }
    })
  );
  return temp;
}

expect.addSnapshotSerializer({
  print(_val) {
    const val = _val as Record<string, string>;
    const contentsByFilename: Record<string, string[]> = {};
    Object.entries(val).forEach(([filename, contents]) => {
      if (contentsByFilename[contents] === undefined) {
        contentsByFilename[contents] = [];
      }
      contentsByFilename[contents].push(filename);
    });
    return Object.entries(contentsByFilename)
      .map(([contents, filenames]) => {
        return `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ ${filenames.join(
          ', '
        )} ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n${contents}`;
      })
      .join('\n');
  },
  test(val) {
    return val && val[dirPrintingSymbol];
  },
});

const dirPrintingSymbol = Symbol('dir printing symbol');

export async function getFiles(dir: string, glob: string[] = ['**']) {
  const files = await fastGlob(glob, { cwd: dir });
  const filesObj: Record<string, string> = {
    [dirPrintingSymbol]: true,
  };
  await Promise.all(
    files.map(async filename => {
      filesObj[filename] = await fs.readFile(path.join(dir, filename), 'utf-8');
    })
  );
  let newObj: Record<string, string> = { [dirPrintingSymbol]: true };
  files.sort().forEach(filename => {
    newObj[filename] = filesObj[filename];
  });
  return newObj;
}
