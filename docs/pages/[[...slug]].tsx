import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'node:fs/promises';
import path from 'node:path';

import { DocPageProps } from '../components/doc-page';
import { extractFrontmatter } from '../utils/frontmatter';
import { transformMarkdoc } from '../utils/markdoc';
import { getDocEntries, projectDir, readDocFile } from '../utils/packages';

type Params = { slug?: string[] };

const docsDir = 'docs/content';

export const getStaticPaths: GetStaticPaths<Required<Params>> = async () => {
  const resolvedDocsDir = path.join(projectDir, docsDir);
  const rootEntries = await fs.readdir(resolvedDocsDir, {
    withFileTypes: true,
  });
  const allEntries = await getDocEntries(rootEntries, resolvedDocsDir, []);
  return {
    paths: allEntries.map(slug => ({
      params: {
        slug: slug[slug.length - 1] === 'index' ? slug.slice(0, -1) : slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DocPageProps> = async ({
  params: _params,
}) => {
  const { slug = [] } = _params as Params;

  const { content: rawDocContent, path } = await readDocFile(docsDir, slug);

  const frontmatter = extractFrontmatter(path, rawDocContent);

  const content = transformMarkdoc(path, rawDocContent);

  return {
    props: {
      content,
      ...frontmatter,
    },
  };
};

export { DocPage as default } from '../components/doc-page';
