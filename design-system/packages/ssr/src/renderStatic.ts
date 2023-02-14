import { cache } from '@emotion/css';
import createEmotionServer from '@emotion/server/create-instance';

/**
 * Takes the HTML of a page (as a string) and returns critical html, css, ids
 * @see https://emotion.sh/docs/ssr#on-server
 */
export async function renderStatic(html: string) {
  if (html === undefined) {
    throw new Error('did you forget to return html from renderToString?');
  }
  const { extractCritical } = createEmotionServer(cache);
  return extractCritical(html);
}
