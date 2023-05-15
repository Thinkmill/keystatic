import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { z } from 'zod';
import { getCookieData } from '../../../cookie-data';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export default function SetupProjectPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    buttonRef.current?.click();
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <form
        method="post"
        action={`https://github.com${
          props.isOrg ? `/organizations/${props.owner}` : ''
        }/settings/apps/new`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <input
          name="manifest"
          type="hidden"
          value={JSON.stringify({
            name: `${props.owner}/${props.repo} Keystatic`,
            url: `https://${props.domain}/keystatic`,
            public: true,
            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/created-app/${router.query.configurationId}`,
            callback_urls: [
              `https://${props.domain}/api/keystatic/github/oauth/callback`,
              'http://localhost:3000/api/keystatic/github/oauth/callback',
              'http://127.0.0.1/api/keystatic/github/oauth/callback',
            ],
            request_oauth_on_install: true,
            default_permissions: {
              contents: 'write',
              metadata: 'read',
              pull_requests: 'read',
            },
          })}
        />
        <button ref={buttonRef} style={{ display: 'none' }} type="submit">
          Create GitHub App
        </button>
      </form>
    </div>
  );
}

const domainsSchema = z.object({
  domains: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .min(1),
});

const projectSchema = z.object({
  link: z.object({
    type: z.literal('github'),
    org: z.string(),
    repo: z.string(),
  }),
});

const ghUserSchema = z.object({
  type: z.union([z.literal('User'), z.literal('Organization')]),
});

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookieData = await getCookieData(
    context.req,
    context.params!.configurationId as string
  );

  const [extraData, domains] = await Promise.all([
    fetch(
      `https://api.vercel.com/v9/projects/${cookieData.projectId}${
        cookieData.teamId ? `?teamId=${cookieData.teamId}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${cookieData.accessToken}`,
        },
      }
    )
      .then(x => x.json())
      .then(project => {
        const parsedProject = projectSchema.safeParse(project);
        if (!parsedProject.success) {
          throw new Error(
            `unexpected project response:\n${JSON.stringify(project, null, 2)}`
          );
        }

        const { org, repo } = parsedProject.data.link;
        return fetch(`https://api.github.com/users/${org}`, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        })
          .then(x => x.json())
          .then(x => {
            const { type } = ghUserSchema.parse(x);
            return { owner: org, repo, isOrg: type === 'Organization' };
          });
      }),
    fetch(
      `https://api.vercel.com/v9/projects/${
        cookieData.projectId
      }/domains?production=true${
        cookieData.teamId ? `&teamId=${cookieData.teamId}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${cookieData.accessToken}`,
        },
      }
    ).then(async res => domainsSchema.safeParse(await res.json())),
  ]);
  if (!domains.success) {
    throw new Error(
      `unexpected domains response:\n${JSON.stringify(domains, null, 2)}`
    );
  }
  if (domains.data.domains.length === 0) {
    throw new Error('expected at least one domain');
  }
  const domain = domains.data.domains[0].name;
  return {
    props: {
      domain,
      ...extraData,
    },
  };
};
