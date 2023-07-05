import PrivacyPolicy from '../../../components/privacy-policy';
import Footer from '../../../components/footer';

export const metadata = {
  title: 'Privacy policy',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main
        tabIndex={-1}
        aria-labelledby="heading-1-overview"
        className="outline-0"
      >
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}
