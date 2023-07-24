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
    <section className="relative bg-keystatic-gray-light">
      <div className="max-w-4xl px-6 pt-6 mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Want to learn more?
          </h2>

          <p className="mt-4 sm:mt-6 text-lg">
            Those sections from the{' '}
            <Link href="/docs" className="underline">
              Keystatic docs
            </Link>{' '}
            are good places to start digging:
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl pt-8 md:pt-12 pb-12 xl:pb-16 overflow-y-auto lg:overflow-visible">
        <ul
          className="px-6 gap-6 grid md:grid-cols-2 xl:gap-8 xl:grid-cols-3 items-stretch"
          role="list"
        >
          {items.map(item => (
            <li key={item.title} className="relative group">
              <div className="h-full rounded-lg border border-keystatic-gray-dark/50 group-hover:border-keystatic-gray-dark transition-all group-hover:shadow-md bg-white">
                <div className="grid h-full grid-rows-[auto,1fr,auto] p-6">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-md text-keystatic-gray-dark">
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
