import Link from 'next/link';
import { KeystaticLogoLink } from './navigation/keystatic-logo-link';
import { SocialLinks } from './navigation/social-links';

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pb-24 pt-16">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:gap-6">
          <KeystaticLogoLink />
          <SocialLinks />
        </div>
        <div className="flex flex-col justify-between gap-x-12 gap-y-4 text-center md:flex-row">
          <p className="text-center text-sm leading-tight text-sand-12 md:text-left">
            <CopyrightPrivacyPolicyContent />
          </p>
          <p className="text-center text-sm leading-tight text-sand-12 md:text-right">
            Made with <span className="text-[#ff3838]">&#9829;</span> in
            Australia by a team from 30 countries.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function DocsFooter() {
  return (
    <footer className="mb-24 py-4">
      <hr className="my-8 mb-8 h-px border-sand-4" />

      <p className="text-sm leading-tight text-sand-11">
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
