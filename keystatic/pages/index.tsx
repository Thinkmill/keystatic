import Link from 'next/link';

export default function Index() {
  return (
    <div>
      This page has some global css.{' '}
      <Link href="/keystatic">Go to Keystatic</Link>
    </div>
  );
}
