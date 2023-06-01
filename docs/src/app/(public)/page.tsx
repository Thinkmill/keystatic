import * as fs from 'fs';
import * as path from 'path';
import EditableHero from '../../components/home-page-editors/editable-hero';
import Intro from '../../components/intro';
import Templates from '../../components/templates';
import MailingList from '../../components/mailing-list';
import CallToAction from '../../components/call-to-action';
import Footer from '../../components/footer';
import Features from '../../components/features';

const initialMarkdoc = fs.readFileSync(
  path.join(
    __dirname,
    '../../../../src/components/home-page-editors/content.mdoc'
  ),
  'utf-8'
);

export default function Homepage() {
  return (
    <>
      <main>
        <EditableHero initialMarkdoc={initialMarkdoc} />
        <Features />
        <Intro />
        <Templates />
        <MailingList />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
