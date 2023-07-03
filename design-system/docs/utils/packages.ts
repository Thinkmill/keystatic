import { Dirent } from 'fs';
import fs from 'node:fs/promises';
import path from 'path';
import { isDefined } from 'emery/guards';
import { categories, Category, extractFrontmatter } from './frontmatter';
import { SidebarItem } from '../components/sidebar';
import { SidebarLink } from '../components/sidebar/types';
import { cache } from './cache';

export const projectDir = path.resolve(process.cwd(), '..');

const pkgSrcDir = path.resolve(projectDir, 'pkg/src');

export async function getDocEntries(
  entries: Dirent[],
  parentFilePath: string,
  parentUrlPortions: string[]
): Promise<string[][]> {
  const docEntries: string[][] = [];
  await Promise.all(
    entries.map(async entry => {
      if (entry.isDirectory()) {
        const dirFilePath = path.join(parentFilePath, entry.name);
        const urlPortions = parentUrlPortions.concat(entry.name);
        const innerEntries = await fs
          .readdir(dirFilePath, { withFileTypes: true })
          .then(entries => getDocEntries(entries, dirFilePath, urlPortions));
        docEntries.push(...innerEntries);
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) return;
      const name = entry.name.slice(0, -3);
      docEntries.push(parentUrlPortions.concat(name));
    })
  );
  return docEntries;
}

type PackageName = string;

type PackageDocSlugs = Map<PackageName, string[][]>;

export const getAllPackageDocSlugs = cache(
  async function getAllPackageDocSlugs(): Promise<PackageDocSlugs> {
    const dirEntries = await readdirE('../pkg/src');
    const entries = await Promise.all(
      dirEntries.map(
        async (entry): Promise<undefined | [string, string[][]]> => {
          if (!entry.isDirectory()) {
            return;
          }
          const docsDir = path.join(pkgSrcDir, entry.name, 'docs');
          let entries;
          try {
            entries = await fs.readdir(docsDir, { withFileTypes: true });
          } catch (err) {
            if ((err as any).code === 'ENOENT') {
              return;
            }
            throw err;
          }
          const allDocEntries = await getDocEntries(entries, docsDir, []);
          return [entry.name, allDocEntries];
        }
      )
    );
    return new Map(entries.filter(isDefined));
  }
);

// these functions exists purely because fs functions don't throw errors with stack traces
// (and ofc it's helpful that fs functions don't throw errors with stack traces
// so that you're not paying the cost of creating a stack trace when you
// want to try doing an fs operation with the expectation that it'll fail
// but it's annoying when we're expecting it won't fail)
export async function readdirE(filePath: string): Promise<Dirent[]> {
  try {
    return await fs.readdir(filePath, { withFileTypes: true });
  } catch (err) {
    throw new Error(`Failed to read directory at ${filePath}: ${err}`);
  }
}

async function readFileE(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw new Error(`Failed to read file at ${filePath}: ${err}`);
  }
}

export const readDocFile = cache(async function readDocFile(
  baseSearchPathRelativeToProject: string,
  slug: string
): Promise<{ content: string; path: string }> {
  const isRootSlug = slug === '';
  const basePath = `${baseSearchPathRelativeToProject}/${slug}`;
  const searchLocations = isRootSlug
    ? [`${basePath}index.md`]
    : [`${basePath}.md`, `${basePath}/index.md`];
  for (const location of searchLocations) {
    try {
      const content = await fs.readFile(
        path.join(projectDir, location),
        'utf-8'
      );
      return { content, path: location };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        continue;
      }
      throw new Error(`Failed to read ${location}: ${err}`);
    }
  }
  throw new Error(
    `Failed to find a doc file for ${basePath}, tried the following locations:\n${searchLocations.join(
      '\n'
    )}`
  );
});

const joinSlug = (slug: string[]): string => {
  if (slug.length === 0) {
    return '';
  }
  if (slug.at(-1) === 'index') {
    return joinSlug(slug.slice(0, -1));
  }

  return '/' + slug.join('/');
};

export async function getNavigation(): Promise<SidebarItem[]> {
  const [packageDocSlugs, docsDirEntries] = await Promise.all([
    getAllPackageDocSlugs(),
    getContentDocEntries(),
  ]);
  type Info = { category: Category | null; title: string; href: string };
  const promises: Promise<Info>[] = [];
  for (const [packageName, docSlugs] of packageDocSlugs) {
    for (const slug of docSlugs) {
      const promise = (async (): Promise<Info> => {
        const href = `/package/${packageName}${joinSlug(slug)}`;
        const filename = `pkg/src/${packageName}/docs/${slug.join('/')}.md`;
        const content = await readFileE(`../${filename}`);
        const { title, category } = extractFrontmatter(filename, content);
        return { category, title, href };
      })();
      promises.push(promise);
    }
  }
  for (const slug of docsDirEntries) {
    const promise = (async (): Promise<Info> => {
      const href = joinSlug(slug);
      const filename = `content/${slug.join('/')}.md`;
      const content = await readFileE(filename);
      const { title, category } = extractFrontmatter(
        `docs/${filename}`,
        content
      );
      return { category, title, href };
    })();
    promises.push(promise);
  }

  const infos = await Promise.all(promises);

  const categoryToLinks = new Map<Category, SidebarLink[]>(
    categories.map(x => [x, []])
  );
  for (const info of infos) {
    if (!info.category) continue;
    const items = categoryToLinks.get(info.category)!;
    items.push({ name: info.title, href: info.href });
  }

  const items: SidebarItem[] = [];
  for (const [name, children] of categoryToLinks) {
    items.push({
      name,
      children: children.sort((a, b) => a.href.localeCompare(b.href)),
    });
  }

  return items;
}

async function getComponentReexports() {
  const pkgSrcDirEntries = await readdirE(pkgSrcDir);
  const packages = (
    await Promise.all(
      pkgSrcDirEntries.map(async entry => {
        if (!entry.isDirectory()) return;
        const innerEntries = await fs.readdir(
          path.join(pkgSrcDir, entry.name),
          { withFileTypes: true }
        );
        for (const innerEntry of innerEntries) {
          if (
            innerEntry.isFile() &&
            (innerEntry.name === 'index.ts' || innerEntry.name === 'index.tsx')
          ) {
            return entry.name;
          }
        }
      })
    )
  ).filter(isDefined);

  return packages
    .sort()
    .filter(x => x !== 'types' && x !== 'test-utils')
    .map(pkg => `export * from '@keystar/ui/${pkg}';`)
    .join('\n');
}

export async function getContentDocEntries() {
  const rootEntries = await readdirE('content');
  return await getDocEntries(rootEntries, 'content', []);
}

export const GENERATED_DIR = 'generated';

export async function writeComponentReexports() {
  const components = await getComponentReexports();
  await fs.writeFile(`${GENERATED_DIR}/components.ts`, components);
}
