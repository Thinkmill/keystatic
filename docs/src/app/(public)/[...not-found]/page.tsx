import { notFound } from 'next/navigation';

/**
 * To be removed when Next.js have added support for catching unmatched routes.
 * Workaround as per https://stackoverflow.com/a/75625136
 */
export default function NotFoundCatchAll() {
  notFound();
}
