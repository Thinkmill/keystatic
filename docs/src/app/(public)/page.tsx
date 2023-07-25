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
        <MailingList />
        <CallToAction />
      </Main>
      <Footer />
    </>
  );
}
