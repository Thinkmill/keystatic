import Link from 'next/link';
import { DiscordIcon } from '../icons/discord-icon';
import { GithubIcon } from '../icons/github-icon';
import { TwitterIcon } from '../icons/twitter-icon';

export function SocialLinks({ tabIndex }: { tabIndex?: number }) {
  const styles =
    'shrink-0 rounded-lg p-3 hover:bg-slate-3 active:bg-slate-5 transition-colors';

  return (
    <div className="flex gap-2">
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
        <span className="sr-only">Keystatic on X (Twitter)</span>
        <TwitterIcon />
      </Link>

      <Link href="/chat" className={styles} tabIndex={tabIndex}>
        <span className="sr-only">Keystatic's Discord server</span>
        <DiscordIcon />
      </Link>
    </div>
  );
}
