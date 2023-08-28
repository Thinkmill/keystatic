import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import DocumentRenderer from '../../../../components/document-renderer';
import { reader } from '../../../../utils/reader';
import { H1_ID } from '../../../../constants';

export default async function Docs({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log({ slug });
  const project = await reader.collections.projects.read(slug);
  if (!project) notFound();

  const content = await project.content();

  return (
    <div className="relative">
      <header className="mx-auto max-w-5xl space-y-6 px-4 pb-12 pt-16 text-center sm:px-6 md:py-16 lg:space-y-8 lg:px-8 lg:pt-20 xl:pt-24">
        {/* In prod, the "root" URL is `/showcase`
          See https://github.com/Thinkmill/keystatic/blob/main/docs/vercel.json#L4-L7 */}
        <Link href="/showcase" className="text-sm underline hover:no-underline">
          &larr; All projects
        </Link>
        <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
          {project.title}
        </h1>
        <div className="mx-auto mt-6 w-full max-w-lg rounded-md bg-black/[0.03] p-4 lg:mt-8">
          <div className="relative aspect-[16/10]">
            <Image
              src={project.coverImage}
              alt=""
              className="absolute inset-0 rounded-md object-cover shadow-lg"
              width={373 * 3}
              height={232 * 3}
              loading="eager"
            />
          </div>
        </div>
        {/* <Badge type={data.type} transition:name={`badge-${slug}`} /> */}
        <p className="mx-auto max-w-xl text-slate-600 md:text-lg">
          {project.summary}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* <ActionButtons data={data} slug={slug} /> */}
        </div>
      </header>

      {content && (
        <main className="bg-white py-12">
          <div className="prose mx-auto px-4 lg:prose-lg sm:px-6 lg:px-8">
            <DocumentRenderer document={content} slug={slug} />
          </div>
        </main>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await reader.collections.projects.list();

  return slugs.map(slug => ({
    slug: [slug],
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const project = await reader.collections.projects.read(slug);

  const parentTitle = (await parent).title ?? 'Showcase';
  const title = project?.title ?? parentTitle;

  const fallbackDescription = 'A project built with Keystatic';
  const description = project?.summary ? project.summary : fallbackDescription;

  const image = `/og?title=${title}`;
  const parentTwitterSite = (await parent).twitter?.site ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keystatic.com/showcase/${slug}`,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: parentTwitterSite,
    },
  };
}
