import Image from 'next/image';
import { notFound } from 'next/navigation';

import { reader } from '../../../utils/reader';

export default async function Showcase() {
  const projects = await reader.collections.projects.all();

  if (!projects) notFound();

  const sortedProjects = projects.sort((a, b) => {
    return (a.entry.sortIndex as number) - (b.entry.sortIndex as number);
  });

  return (
    <>
      <div className="text-center">
        <h1 className="text-5xl font-extrabold">Built with Keystatic</h1>
        <p className="mt-2 text-lg md:mt-4">
          A collection of projects using Keystatic to manage parts of their
          codebase.
        </p>
      </div>
      <ul className="grid gap-x-6 gap-y-16 py-8 sm:grid-cols-2 sm:py-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 lg:py-16 xl:gap-x-12 xl:gap-y-16">
        {sortedProjects.map(async ({ slug, entry }) => {
          return (
            <li>
              <div className="rounded-md bg-black/[0.03] p-3">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={entry.coverImage}
                    layout="fill"
                    alt=""
                    className="absolute inset-0 w-full rounded-lg object-cover shadow-lg"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="font-semibold group-hover:underline xl:text-lg">
                  {entry.title}
                </h2>
                {/* <Badge type={entry.type} transition:name={`badge-${slug}`} /> */}
              </div>
              <p className="mt-1 text-slate-600">{entry.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {/* <ActionButtons data={data} slug={slug} body={body} /> */}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
