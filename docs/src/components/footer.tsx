import Link from 'next/link';

import { KeystaticLogo, SocialLinks } from './navigation';

export default function Footer() {
  return (
    <footer className="bg-keystatic-gray-light pb-10">
      <div className="mx-auto max-w-7xl">
        <nav className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <KeystaticLogo />
          <SocialLinks />
        </nav>
      </div>

      <div className="mx-auto mt-2 flex max-w-7xl flex-col justify-between gap-y-4 gap-x-12 px-6 text-center md:flex-row">
        <p className="leading-tight text-keystatic-gray-dark text-center md:text-left">
          &copy; {new Date().getFullYear()} Thinkmill. All rights reserved.{' '}
          <Link href="/privacy-policy" className="underline hover:text-black">
            Privacy policy
          </Link>
        </p>
        <p className="leading-tight text-keystatic-gray-dark text-center md:text-right">
          Made with <span className="text-[#ff3838]">♥</span> in Australia by a
          team from 30 countries.
        </p>
      </div>
    </footer>
  );
}
