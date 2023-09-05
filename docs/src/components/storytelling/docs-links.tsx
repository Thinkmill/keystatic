import Link from 'next/link';

export default function DocsLinks() {
  const items = [
    {
      title: 'Getting started options',
      description:
        'Read about the various options to get started with Keystatic',
      href: '/docs/introduction',
    },
    {
      title: 'Framework guides',
      description: 'Add Keystatic to an existing Astro or Next.js project',
      href: '/docs/installation-astro',
    },
    {
      title: 'Connect to GitHub',
      description: 'Learn more about connecting Keystatic to GitHub',
      href: 'docs/connect-to-github',
    },
    {
      title: 'Organised content',
      description:
        'Teach Keystatic how to find and organise the content in your codebase',
      href: '/docs/how-keystatic-organises-your-content',
    },
    {
      title: 'Content structures',
      description: 'Setup Collections and Singletons to edit your content',
      href: '/docs/collections',
    },
    {
      title: 'Reader API',
      description:
        'Retrieve data from your project directory with the Reader API',
      href: 'docs/reader-api',
    },
  ];
  return (
    <section className="relative bg-slate-3">
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Want to learn more?
          </h2>

          <p className="mt-4 text-lg sm:mt-6">
            Those sections from the{' '}
            <Link href="/docs" className="underline">
              Keystatic docs
            </Link>{' '}
            are good places to start digging:
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl overflow-y-auto pb-12 pt-8 md:pt-12 lg:overflow-visible xl:pb-16">
        <ul
          className="grid items-stretch gap-6 px-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8"
          role="list"
        >
          {items.map(item => (
            <li key={item.title} className="group relative">
              <div className="h-full rounded-lg border border-slate-11/50 bg-white transition-all group-hover:border-slate-11 group-hover:shadow-md">
                <div className="grid h-full grid-rows-[auto,1fr,auto] p-6">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-md mt-2 text-slate-11">
                    {item.description}
                  </p>
                </div>
              </div>
              <Link href={item.href} className="absolute inset-0" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
