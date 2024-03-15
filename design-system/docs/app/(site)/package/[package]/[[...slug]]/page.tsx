import { Metadata } from 'next';
import { DocPage } from '../../../../../components/doc-page';
import { extractFrontmatter } from '../../../../../utils/frontmatter';
import { transformMarkdoc } from '../../../../../utils/markdoc';
import {
  getAllPackageDocSlugs,
  readDocFile,
} from '../../../../../utils/packages';

export async function generateStaticParams() {
  const slugs = await getAllPackageDocSlugs();
  const paths: { package: string; slug: string[] }[] = [];
  for (const [pkg, slugsForPkg] of slugs) {
    for (const slug of slugsForPkg) {
      paths.push({
        package: pkg,
        slug: slug[slug.length - 1] === 'index' ? slug.slice(0, -1) : slug,
      });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: { package: string; slug?: string[] };
}): Promise<Metadata> {
  const { content: rawDocContent, path } = await readDocFile(
    `pkg/src/${params.package}/docs`,
    (params.slug ?? []).join('/')
  );

  const frontmatter = extractFrontmatter(path, rawDocContent);
  return { title: frontmatter.title };
}

export default async function Page(props: {
  params: { slug?: string[]; package: string };
}) {
  const { content: rawDocContent, path } = await readDocFile(
    `pkg/src/${props.params.package}/docs`,
    (props.params.slug ?? []).join('/')
  );

  const frontmatter = extractFrontmatter(path, rawDocContent);

  const content = transformMarkdoc(path, rawDocContent);

  return <DocPage content={content} {...frontmatter} />;
}
