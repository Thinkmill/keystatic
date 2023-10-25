import Link from 'next/link';
import { GitHubOutlineIcon } from '../icons/github-outline-icon';

export function EditOnGitHub({ slug }: { slug: string }) {
  const editUrl = `https://github.com/Thinkmill/keystatic/edit/main/docs/src/content/pages/${slug}.mdoc`;
  return (
    <>
      <hr className="mt-6 w-10 border-slate-5" />
      <Link
        href={editUrl}
        className="group mt-4 flex items-center gap-1 text-xs text-slate-9 hover:underline"
      >
        <GitHubOutlineIcon className="h-4 w-4 text-slate-9 group-hover:text-slate-10" />
        Edit this page
      </Link>
    </>
  );
}
