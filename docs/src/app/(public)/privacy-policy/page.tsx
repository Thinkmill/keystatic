import PrivacyPolicy from '../../../components/privacy-policy';
import Footer from '../../../components/footer';
import { Main } from '../../../components/main';

export const metadata = {
  title: 'Privacy policy',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Main>
        <PrivacyPolicy />
      </Main>
      <Footer />
    </>
  );
}
