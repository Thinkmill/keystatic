import Hero from '../../components/hero';
import CliVideo from '../../components/storytelling/cli-video';
import { CloudBanner } from '../../components/cloud-banner';
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
        <CloudBanner />
        <DocsLinks />
        <div className="grid sm:grid-cols-2">
          <MailingList />
          <CallToAction />
        </div>
      </Main>
      <Footer />
    </>
  );
}
