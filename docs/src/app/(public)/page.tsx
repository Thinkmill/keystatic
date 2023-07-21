import Hero from '../../components/hero';
import Intro from '../../components/intro';
import Storytelling from '../../components/storytelling';
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
        <Intro />
        <Storytelling />
        <MailingList />
        <CallToAction />
      </Main>
      <Footer />
    </>
  );
}
