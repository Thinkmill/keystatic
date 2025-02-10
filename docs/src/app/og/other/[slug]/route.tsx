import { renderOgImage } from '../../og';

const pages: Record<string, string> = {
  blog: 'Blog',
  'privacy-policy': 'Privacy Policy',
  resources: 'Resources',
  showcase: 'Showcase',
};

export async function generateStaticParams() {
  return Object.keys(pages).map(slug => ({ slug }));
}

export const dynamicParams = false;

export async function GET(
  _: Request,
  props: { params: Promise<{ slug: string }> }
) {
  if (!pages[(await props.params).slug]) {
    return new Response('Not Found', { status: 404 });
  }
  return renderOgImage(pages[(await props.params).slug]);
}
