import Navigation from '../components/navigation';
import Hero from '../components/hero';
import Intro from '../components/intro';
import Templates from '../components/templates';
import MailingList from '../components/mailing-list';
import CallToAction from '../components/call-to-action';
import Footer from '../components/footer';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader('', keystaticConfig);

export default function Index({ navigationMap }: any) {
  return (
    <div className="min-h-screen">
      <Navigation navigationMap={navigationMap} />

      <main>
        <Hero />
        <Intro />
        <Templates />
        <MailingList />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const navigation = await reader.singletons.navigation.read();
  const pages = await reader.collections.pages.all();

  const pagesBySlug = Object.fromEntries(pages.map(page => [page.slug, page]));

  const navigationMap = navigation?.navGroups.map(({ groupName, items }) => ({
    groupName,
    items: items.map(({ label, link }) => {
      const { discriminant, value } = link;
      const page = discriminant === 'page' && value ? pagesBySlug[value] : null;
      const url = discriminant === 'url' ? value : `/docs/${page?.slug}`;

      return {
        label: label || page?.entry.title || '',
        href: url || '',
        title: page?.entry.title || '',
      };
    }),
  }));

  return { props: { navigationMap } };
}
