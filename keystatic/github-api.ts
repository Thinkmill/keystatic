import { request } from '@octokit/request';
import { Endpoints, RequestRequestOptions } from '@octokit/types';
import { getAuth } from './app/auth';

export async function githubRequest<R extends keyof Endpoints>(
  route: R,
  options?: Endpoints[R]['parameters'] & { request?: RequestRequestOptions }
): Promise<Endpoints[R]['response']> {
  return (request as any)(route, {
    ...options,
    headers: { authorization: `token ${(await getAuth())?.accessToken}` },
  });
}
