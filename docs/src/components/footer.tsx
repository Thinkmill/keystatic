import Link from 'next/link';
import { KeystaticLogoLink } from './navigation/keystatic-logo-link';
import { SocialLinks } from './navigation/social-links';

export default function Footer() {
  return (
    <footer className="bg-sand-7 pb-20 pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-2 px-6 py-4 md:flex-row md:gap-6">
          <KeystaticLogoLink />
          <SocialLinks />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-x-12 gap-y-4 px-6 text-center md:flex-row">
        <p className="text-center leading-tight text-slate-11 md:text-left">
          <CopyrightPrivacyPolicyContent />
        </p>

        <p className="text-center leading-tight text-slate-11 md:text-right">
          Made with <span className="text-[#ff3838]">❤️</span> in Australia by a
          team from 30 countries.
        </p>
      </div>
    </footer>
  );
}

export function DocsFooter() {
  return (
    <footer className="mb-24 py-4">
      <hr className="my-8 mb-8 h-px border-slate-4" />

      <p className="text-sm leading-tight text-slate-11">
        <CopyrightPrivacyPolicyContent />
      </p>
    </footer>
  );
}

function CopyrightPrivacyPolicyContent() {
  return (
    <>
      &copy; {new Date().getFullYear()} Thinkmill. All rights reserved.{' '}
      <Link href="/privacy-policy" className="underline hover:text-black">
        Privacy policy
      </Link>
    </>
  );
}
