import Hero from '../../components/hero';
import CliVideo from '../../components/storytelling/cli-video';
import DocsLinks from '../../components/storytelling/docs-links';
import MailingList from '../../components/mailing-list';
import CallToAction from '../../components/call-to-action';
import Footer from '../../components/footer';
import Features from '../../components/features';
import { Main } from '../../components/main';

export default function Homepage() {
  return (
    <>
      <Main isFocusable={false}>
        <Hero />
        <Features />
        <CliVideo />
        <DocsLinks />
        <div className="bg-sand-2">
          <div className="mx-auto grid max-w-5xl divide-y divide-sand-6 md:grid-cols-2 md:divide-x md:divide-y-0">
            <MailingList />
            <CallToAction />
          </div>
        </div>
      </Main>
      <Footer />
    </>
  );
}
