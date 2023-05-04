import Link from "next/link";

import Navigation from "./navigation";

export default function Footer() {
  return (
    <footer className="bg-keystatic-gray-light pb-10">
      <Navigation showCta={false} />
      <div className="mx-auto mt-4 flex max-w-7xl flex-col justify-between gap-y-4 gap-x-12 px-6 text-center md:flex-row md:text-left">
        <p className="leading-none text-keystatic-gray-dark">
          &copy; {new Date().getFullYear()} Thinkmill. All rights reserved.{" "}
          <Link href="/privacy-policy" className="underline hover:text-black">
            Privacy policy
          </Link>
        </p>
        <p className="leading-none text-keystatic-gray-dark">
          Made with <span className="text-[#ff3838]">♥</span> in Australia by a
          team from 30 countries.
        </p>
      </div>
    </footer>
  );
}
