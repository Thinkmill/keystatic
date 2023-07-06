import PrivacyPolicy from '../../../components/privacy-policy';
import Footer from '../../../components/footer';

export const metadata = {
  title: 'Privacy policy',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main>
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}
