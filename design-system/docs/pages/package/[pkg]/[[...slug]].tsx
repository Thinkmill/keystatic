import { GetStaticPaths, GetStaticProps } from 'next';

import {
  getAllPackageDocSlugs,
  readdirE,
  readDocFile,
} from '../../../utils/packages';
import { transformMarkdoc } from '../../../utils/markdoc';
import { DocPageProps } from '../../../components/doc-page';
import { extractFrontmatter } from '../../../utils/frontmatter';

type Params = { slug?: string[]; pkg: string };

export const getStaticPaths: GetStaticPaths<Required<Params>> = async () => {
  const slugs = await getAllPackageDocSlugs(await readdirE('../packages'));
  const paths: { params: Required<Params> }[] = [];
  for (const [pkg, slugsForPkg] of slugs) {
    for (const slug of slugsForPkg) {
      paths.push({
        params: {
          pkg,
          slug: slug[slug.length - 1] === 'index' ? slug.slice(0, -1) : slug,
        },
      });
    }
  }
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DocPageProps> = async ({
  params: _params,
}) => {
  const { pkg, slug = [] } = _params as Params;
  const { content: rawDocContent, path } = await readDocFile(
    `packages/${pkg}/docs`,
    slug
  );

  const frontmatter = extractFrontmatter(path, rawDocContent);

  const content = transformMarkdoc(path, rawDocContent);

  return {
    props: {
      content,
      ...frontmatter,
    },
  };
};

export { DocPage as default } from '../../../components/doc-page';
