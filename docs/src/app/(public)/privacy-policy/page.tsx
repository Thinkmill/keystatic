import PrivacyPolicy from '../../../components/privacy-policy';
import Footer from '../../../components/footer';
import { Main } from '../../../components/main';

export const metadata = {
  title: {
    template: '%s - Privacy policy | Keystatic',
    default: 'Privacy policy',
  },
  description:
    'Keystatic is software developed and maintained by Thinkmill Labs Pty Ltd (“Thinkmill”).',
  openGraph: {
    title: 'Privacy policy',
    description:
      'Keystatic is software developed and maintained by Thinkmill Labs Pty Ltd (“Thinkmill”).',
    images: [
      {
        url: '/og/other/privacy-policy',
      },
    ],
    siteName: 'Keystatic',
    type: 'website',
    url: 'https://keystatic.com/privacy-policy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy policy',
    description:
      'Keystatic is software developed and maintained by Thinkmill Labs Pty Ltd (“Thinkmill”).',
    site: '@thekeystatic',
  },
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
