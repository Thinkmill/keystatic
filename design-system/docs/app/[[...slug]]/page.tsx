import { Metadata } from 'next';
import fs from 'node:fs/promises';
import path from 'node:path';

import { DocPage } from '../../components/doc-page';
import { extractFrontmatter } from '../../utils/frontmatter';
import { transformMarkdoc } from '../../utils/markdoc';
import { getDocEntries, projectDir, readDocFile } from '../../utils/packages';

const docsDir = 'docs/content';

export async function generateStaticParams() {
  const resolvedDocsDir = path.join(projectDir, docsDir);
  const rootEntries = await fs.readdir(resolvedDocsDir, {
    withFileTypes: true,
  });
  const allEntries = await getDocEntries(rootEntries, resolvedDocsDir, []);
  return allEntries.map(slug => ({
    slug: slug[slug.length - 1] === 'index' ? slug.slice(0, -1) : slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const { content: rawDocContent, path } = await readDocFile(
    docsDir,
    (params.slug ?? []).join('/')
  );

  const frontmatter = extractFrontmatter(path, rawDocContent);
  return { title: frontmatter.title };
}

export default async function Page(props: { params: { slug?: string[] } }) {
  const { content: rawDocContent, path } = await readDocFile(
    docsDir,
    (props.params.slug ?? []).join('/')
  );

  const frontmatter = extractFrontmatter(path, rawDocContent);

  const content = transformMarkdoc(path, rawDocContent);

  return <DocPage content={content} {...frontmatter} />;
}
