import { ImageResponse, NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const postTitle = searchParams.get('title') || '';
  const fontData = await fetch(
    new URL(
      '../../../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff',
      import.meta.url
    )
  ).then(res => res.arrayBuffer());

  const titleLength = postTitle.length;

  let titleSize = '120px';
  if (titleLength > 18) titleSize = '96px';
  if (titleLength > 32) titleSize = '84px';

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
          backgroundImage: `url(https://thinkmill-labs.keystatic.net/keystatic-site/images/nt24l5xes6jj/open-graph-bg)`,
        }}
      >
        <div
          style={{
            marginLeft: 900,
            marginRight: 100,
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 700,
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
      width: 1801,
      height: 945,
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
