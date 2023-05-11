import Navigation from '../components/navigation';
import PrivacyPolicy from '../components/privacy-policy';
import Footer from '../components/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <PrivacyPolicy />
      </main>
      <Footer />
    </div>
  );
}
