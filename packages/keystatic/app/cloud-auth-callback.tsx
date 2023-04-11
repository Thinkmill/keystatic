import { ProgressCircle } from '@voussoir/progress';
import { Text } from '@voussoir/typography';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Config } from '../config';
import { useRouter } from './router';
import { KEYSTATIC_CLOUD_API_URL, KEYSTATIC_CLOUD_HEADERS } from './utils';

const storedStateSchema = z.object({
  state: z.string(),
  from: z.string(),
  code_verifier: z.string(),
});
const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

export function KeystaticCloudAuthCallback(props: { config: Config }) {
  const router = useRouter();
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = useMemo(() => {
    const _storedState = localStorage.getItem('keystatic-cloud-state');
    const storedState = storedStateSchema.safeParse(
      (() => {
        try {
          return JSON.parse(_storedState || '');
        } catch {
          return null;
        }
      })()
    );
    return storedState;
  }, []);
  const [error, setError] = useState<null | Error>(null);
  useEffect(() => {
    const { storage } = props.config;
    if (code && state && storedState.success && storage.kind === 'cloud') {
      (async () => {
        const res = await fetch(`${KEYSTATIC_CLOUD_API_URL}/oauth/token`, {
          method: 'POST',
          body: new URLSearchParams({
            code,
            client_id: storage.project,
            redirect_uri: `${window.location.origin}/keystatic/cloud/oauth/callback`,
            code_verifier: storedState.data.code_verifier,
            grant_type: 'authorization_code',
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...KEYSTATIC_CLOUD_HEADERS,
          },
        });
        if (!res.ok) {
          throw new Error(
            `Bad response: ${res.status} ${
              res.statusText
            }\n\n${await res.text()}`
          );
        }
        const data = await res.json();
        const parsed = tokenResponseSchema.parse(data);
        localStorage.setItem(
          'keystatic-cloud-access-token',
          JSON.stringify({
            token: parsed.access_token,
            validUntil: Date.now() + parsed.expires_in * 1000,
          })
        );
        router.push(`/keystatic/${storedState.data.from}`);
      })().catch(error => {
        setError(error);
      });
    }
  }, [code, state, router, storedState, props.config]);
  if (props.config.storage.kind !== 'cloud') {
    return <Text>Missing Keystatic Cloud config</Text>;
  }
  if (!code || !state) {
    return <Text>Missing code or state</Text>;
  }
  if (storedState.success === false || state !== storedState.data.state) {
    return <Text>Invalid state</Text>;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }
  return (
    <div>
      <ProgressCircle isIndeterminate aria-label="Authenticating" />
    </div>
  );
}
