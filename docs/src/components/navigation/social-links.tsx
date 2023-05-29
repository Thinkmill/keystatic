import Link from 'next/link';
import { MastodonIcon } from '../icons/mastodon-icon';
import { GithubIcon } from '../icons/github-icon';
import { TwitterIcon } from '../icons/twitter-icon';

export function SocialLinks({ tabIndex }: { tabIndex?: number }) {
  const styles =
    'shrink-0 rounded-lg p-3 hover:bg-keystatic-gray-light active:bg-keystatic-gray transition-colors';

  return (
    <div className="flex gap-2">
      <Link
        href="https://fosstodon.org/@keystatic"
        className={styles}
        tabIndex={tabIndex}
      >
        <span className="sr-only">Keystatic on Mastodon</span>
        <MastodonIcon />
      </Link>

      <Link
        href="https://github.com/thinkmill/keystatic"
        className={styles}
        tabIndex={tabIndex}
      >
        <span className="sr-only">Keystatic on GitHub</span>
        <GithubIcon />
      </Link>

      <Link
        href="https://twitter.com/thekeystatic"
        className={styles}
        tabIndex={tabIndex}
      >
        <span className="sr-only">Keystatic on Twitter</span>
        <TwitterIcon />
      </Link>
    </div>
  );
}
