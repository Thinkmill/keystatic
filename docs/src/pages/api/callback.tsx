import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import Iron from '@hapi/iron';
import cookie from 'cookie';

const expectedParamsSchema = z.object({
  code: z.string(),
  configurationId: z.string(),
  currentProjectId: z.string(),
  teamId: z.string().optional(),
  next: z.string(),
});

const accessTokenResponseSchema = z.object({
  token_type: z.string(),
  access_token: z.string(),
  installation_id: z.string(),
  user_id: z.string(),
});

// const projectsSchema = z.array(
//   z.object({
//     id: z.string(),
//     alias: z.array(z.object({ domain: z.string() })).optional(),
//     link: z
//       .object({
//         type: z.string().optional(),
//         org: z.string().optional(),
//         repo: z.string(),
//       })
//       .optional(),
//     env: z.array(
//       z.object({
//         key: z.string(),
//         value: z.string(),
//       })
//     ),
//   })
// );

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const params = expectedParamsSchema.safeParse(req.query);

  if (!params.success) {
    res.status(400).send('Unexpected query parameters');
    return;
  }

  const accessTokenRes = await fetch(
    'https://api.vercel.com/v2/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_VERCEL_CLIENT_ID!,
        client_secret: process.env.VERCEL_CLIENT_SECRET!,
        code: params.data.code,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/callback`,
      }).toString(),
    }
  );
  if (!accessTokenRes.ok) {
    res.status(500).send('Failed to get access token');
    return;
  }

  const accessTokenData = accessTokenResponseSchema.safeParse(
    await accessTokenRes.json()
  );

  if (!accessTokenData.success) {
    res.status(500).send('Bad access token data');
    return;
  }

  const data = new URLSearchParams({
    t: accessTokenData.data.access_token,
    i: accessTokenData.data.installation_id,
    p: params.data.currentProjectId,
    u: accessTokenData.data.user_id,
    n: params.data.next,
    ...(params.data.teamId ? { e: params.data.teamId } : {}),
  }).toString();

  const cookieData = await Iron.seal(
    data,
    process.env.SESSION_SECRET!,
    Iron.defaults
  );

  res.setHeader(
    'Set-Cookie',
    cookie.serialize(`ks-${params.data.configurationId}`, cookieData, {
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      maxAge: 60 * 60 * 24,
    })
  );
  res.redirect(`/setup/${params.data.configurationId}`);
}
