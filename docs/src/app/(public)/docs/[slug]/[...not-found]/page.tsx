import { notFound } from 'next/navigation';

/**
 * Workaround as per https://stackoverflow.com/a/75625136
 */
export default function NotFoundCatchAll() {
  notFound();
}
