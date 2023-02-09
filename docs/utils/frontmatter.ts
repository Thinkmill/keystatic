import { load } from 'js-yaml';

const frontMatterPattern = /^---[\s]+([\s\S]*?)[\s]+---/;

export const categories = [
  'Introduction',
  'Concepts',
  'Layout',
  'Typography',
  'Forms',
  'Navigation',
  'Overlays',
  'Feedback',
  'Media',
] as const;

export type Category = typeof categories[number];

const categoriesSet = new Set<string>(categories);

function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && categoriesSet.has(value);
}

function baseExtractFrontmatter(content: string): {
  title: string;
  category: Category | null;
  description: string | null;
} {
  const match = frontMatterPattern.exec(content);
  if (!match) {
    throw new Error(
      'Expected document to contain frontmatter with at least a title'
    );
  }
  const frontmatter = match[1];
  let parsed;
  try {
    parsed = load(frontmatter);
  } catch (err) {
    throw new Error(`Failed to parse frontmatter as yaml: ${err}`);
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(
      `Expected frontmatter yaml to be an object but found:\n${JSON.stringify(
        parsed
      )}`
    );
  }
  let obj = parsed as Record<string, unknown>;
  if (typeof obj.title !== 'string') {
    throw new Error(`Expected frontmatter to contain a title`);
  }
  if (obj.category !== undefined && !isCategory(obj.category)) {
    throw new Error(
      `Expected category in frontmatter to be one of ${categories.join(
        ', '
      )} if it exists`
    );
  }
  if (typeof obj.description !== 'string' && obj.description !== undefined) {
    throw new Error(
      `Expected description in frontmatter to be a string if it exists`
    );
  }

  return {
    title: obj.title,
    category: obj.category ?? null,
    description: obj.description ?? null,
  };
}

export function extractFrontmatter(filename: string, content: string) {
  try {
    return baseExtractFrontmatter(content);
  } catch (err) {
    throw new Error(`Failed to get frontmatter from ${filename}: ${err}`);
  }
}
