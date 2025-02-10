import { reader } from '../../../../utils/reader';
import { renderOgImage } from '../../og';

export async function generateStaticParams() {
  const slugs = await reader().collections.projects.list();
  return slugs.map(slug => ({ slug: slug.split('/') }));
}

export const dynamicParams = false;

export async function GET(
  _: Request,
  props: { params: Promise<{ slug: string[] }> }
) {
  const post = await reader().collections.projects.readOrThrow(
    (await props.params).slug.join('/')
  );
  return renderOgImage(post.title);
}
