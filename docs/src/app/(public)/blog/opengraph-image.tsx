import { ImageResponse } from 'next/server';
import OgImage from '../../../components/og-image';

export const runtime = 'edge';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const title = 'Blog';

export default async function Image() {
  return new ImageResponse(<OgImage title={title} />, {
    ...size,
  });
}
