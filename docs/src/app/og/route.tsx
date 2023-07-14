import { ImageResponse, NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const postTitle = searchParams.get('title') || '';
  const font = fetch(
    new URL('../../../public/fonts/Inter-ExtraBold.ttf', import.meta.url)
  ).then(res => res.arrayBuffer());
  const fontData = await font;

  const titleLength = postTitle.length;

  let titleSize = '80px';
  if (titleLength > 18) titleSize = '64px';
  if (titleLength > 32) titleSize = '56px';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundImage: 'url(http://localhost:3000/opengraph-bg.png)',
        }}
      >
        <div
          style={{
            marginLeft: 600,
            marginRight: 40,
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 800,
            fontFamily: 'Inter',
            letterSpacing: '-0.025em',
            fontStyle: 'normal',
            lineHeight: titleSize,
            whiteSpace: 'pre-wrap',
          }}
        >
          {postTitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
}
