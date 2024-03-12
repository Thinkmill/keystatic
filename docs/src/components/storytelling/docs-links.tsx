import Link from 'next/link';
import { ArrowRightIcon } from '../icons/arrow-right';
import { NextJSIcon } from '../icons/nextjs-icon';
import { AstroIcon } from '../icons/astro-icon';
import { KeystaticIcon } from '../icons/keystatic-icon';

const docs = [
  {
    label: 'Getting started',
    description: 'Read about the various options to get started with Keystatic',
    link: '/docs/introduction',
    bgSVG: (
      <svg
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group-hover:scale-125"
        viewBox="0 0 324 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="url(#pattern1-a)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M0 44h324"
        />
        <path
          stroke="url(#pattern1-b)"
          strokeWidth="96"
          d="M0 140h90l96-96h138"
        />
        <path
          stroke="url(#pattern1-c)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M0 44h324"
          opacity=".4"
        />
        <defs>
          <linearGradient
            id="pattern1-a"
            x1="0"
            x2="211.24"
            y1="44"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AADEE6" />
            <stop offset="1" stopColor="#F3C6E2" />
          </linearGradient>
          <linearGradient
            id="pattern1-b"
            x1="82"
            x2="366"
            y1="140"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF8BB" />
            <stop offset="1" stopColor="#D7CFF9" />
          </linearGradient>
          <linearGradient
            id="pattern1-c"
            x1="0"
            x2="211.24"
            y1="44"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AADEE6" />
            <stop offset="1" stopColor="#F3C6E2" />
          </linearGradient>
        </defs>
      </svg>
    ),
    content: (
      <div className="relative flex h-full items-center px-8 py-4">
        <div className="relative h-20 w-full overflow-hidden rounded-lg border border-sand-12 bg-whiteAlpha-12 transition-all duration-150 group-hover:h-full">
          <div className="absolute left-0 right-0 top-0 flex gap-1.5 p-3">
            <div className="h-2 w-2 rounded-full bg-sand-9" />
            <div className="h-2 w-2 rounded-full bg-sand-9" />
            <div className="h-2 w-2 rounded-full bg-sand-9" />
          </div>
          <div className="h-full overflow-auto pt-8">
            <div className="h-full overflow-auto overscroll-auto px-3 pb-3 font-mono text-xs">
              <p>
                <span className="text-sand-9">&gt;_</span>
                <span className="text-sand-11"> npm</span>
                <span> create @keystatic@latest</span>
                <span className="inline animate-pulse text-sand-9 group-hover:hidden">
                  █
                </span>
              </p>
              <div className="hidden group-hover:inline-block ">
                <p>
                  <span className="text-sand-9">==&gt;</span>
                  <span> Keystatic - let’s get you setup</span>
                </p>
                <p>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+---+</span>
                </p>
                <p>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;|
                  </span>
                </p>
                <p>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+---+
                  </span>
                </p>
                <p>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;+---&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
                  </span>
                </p>
                <p>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;/
                  </span>
                </p>
                <p>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+---+
                  </span>
                </p>
                <p>
                  <span className="text-sand-9">==&gt;</span>
                  <span> Pick a framework to use with Keystatic</span>
                </p>
                <p>
                  <span className="text-sand-9">-</span>
                  <span> Next.js</span>
                </p>
                <p>
                  <span className="text-sand-9">-</span>
                  <span> Astro</span>
                  <span className="animate-pulse text-sand-9">█</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'Framework guides',
    description: 'Add Keystatic to an existing Astro or Next.js project',
    link: '/docs/installation-astro',
    bgSVG: (
      <svg
        className="absolute left-1/2 top-1/2 h-96 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group-hover:scale-125"
        width="324"
        height="184"
        viewBox="0 0 324 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="url(#pattern2-a)"
          strokeWidth="96"
          d="M221-33 47 140v71"
        />
        <path
          stroke="url(#pattern2-b)"
          strokeWidth="96"
          d="M357-34 143 179v51"
        />
        <path
          stroke="url(#pattern2-c)"
          strokeWidth="96"
          d="m196 58 104 104v78"
        />
        <path
          stroke="url(#pattern2-d)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M163 159 331-9"
          opacity=".4"
        />
        <defs>
          <linearGradient
            id="pattern2-a"
            x1="128"
            x2="47"
            y1="44.5"
            y2="140.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4DEFC" />
            <stop offset="1" stopColor="#FDD8D3" />
          </linearGradient>
          <linearGradient
            id="pattern2-b"
            x1="206"
            x2="143"
            y1="121"
            y2="181"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE0A1" />
            <stop offset="1" stopColor="#CEEBCF" />
          </linearGradient>
          <linearGradient
            id="pattern2-c"
            x1="207"
            x2="300"
            y1="69"
            y2="164"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4DEFC" />
            <stop offset="1" stopColor="#C4EAEF" />
          </linearGradient>
          <linearGradient
            id="pattern2-d"
            x1="226"
            x2="163"
            y1="101"
            y2="161"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE0A1" />
            <stop offset="1" stopColor="#CEEBCF" />
          </linearGradient>
        </defs>
      </svg>
    ),
    content: (
      <>
        {/* grid svg */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-sandAlpha-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="641"
          height="257"
          viewBox="0 0 641 257"
        >
          <path
            fillRule="evenodd"
            d="M0 0h641v257H0V0Zm640 1h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0h-15v15h15V1Zm-16 0H97v15h15V1ZM96 1H81v15h15V1ZM80 1H65v15h15V1ZM64 1H49v15h15V1ZM48 1H33v15h15V1ZM32 1H17v15h15V1ZM16 1H1v15h15V1ZM1 32V17h15v15H1Zm16 0V17h15v15H17Zm16 0V17h15v15H33Zm16 0V17h15v15H49Zm16 0V17h15v15H65Zm16 0V17h15v15H81Zm16 0V17h15v15H97Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm16 0V17h15v15h-15Zm15 1h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0h-15v15h15V33Zm-16 0H97v15h15V33Zm-16 0H81v15h15V33Zm-16 0H65v15h15V33Zm-16 0H49v15h15V33Zm-16 0H33v15h15V33Zm-16 0H17v15h15V33Zm-16 0H1v15h15V33ZM1 64V49h15v15H1Zm16 0V49h15v15H17Zm16 0V49h15v15H33Zm16 0V49h15v15H49Zm16 0V49h15v15H65Zm16 0V49h15v15H81Zm16 0V49h15v15H97Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm16 0V49h15v15h-15Zm15 1h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0h-15v15h15V65Zm-16 0H97v15h15V65Zm-16 0H81v15h15V65Zm-16 0H65v15h15V65Zm-16 0H49v15h15V65Zm-16 0H33v15h15V65Zm-16 0H17v15h15V65Zm-16 0H1v15h15V65ZM1 96V81h15v15H1Zm16 0V81h15v15H17Zm16 0V81h15v15H33Zm16 0V81h15v15H49Zm16 0V81h15v15H65Zm16 0V81h15v15H81Zm16 0V81h15v15H97Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm16 0V81h15v15h-15Zm15 1h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0h-15v15h15V97Zm-16 0H97v15h15V97Zm-16 0H81v15h15V97Zm-16 0H65v15h15V97Zm-16 0H49v15h15V97Zm-16 0H33v15h15V97Zm-16 0H17v15h15V97Zm-16 0H1v15h15V97ZM1 128v-15h15v15H1Zm16 0v-15h15v15H17Zm16 0v-15h15v15H33Zm16 0v-15h15v15H49Zm16 0v-15h15v15H65Zm16 0v-15h15v15H81Zm16 0v-15h15v15H97Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm15 1h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0h-15v15h15v-15Zm-16 0H97v15h15v-15Zm-16 0H81v15h15v-15Zm-16 0H65v15h15v-15Zm-16 0H49v15h15v-15Zm-16 0H33v15h15v-15Zm-16 0H17v15h15v-15Zm-16 0H1v15h15v-15ZM1 160v-15h15v15H1Zm16 0v-15h15v15H17Zm16 0v-15h15v15H33Zm16 0v-15h15v15H49Zm16 0v-15h15v15H65Zm16 0v-15h15v15H81Zm16 0v-15h15v15H97Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15Zm16 0v-15h15v15h-15ZM1 161v15h15v-15H1Zm16 0v15h15v-15H17Zm16 0v15h15v-15H33Zm16 0v15h15v-15H49Zm16 0v15h15v-15H65Zm16 0v15h15v-15H81Zm16 0v15h15v-15H97Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm16 0v15h15v-15h-15Zm15 80v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15H97v-15h15Zm-16 0v15H81v-15h15Zm-16 0v15H65v-15h15Zm-16 0v15H49v-15h15Zm-16 0v15H33v-15h15Zm-16 0v15H17v-15h15Zm-16 0v15H1v-15h15Zm-15-1h15v-15H1v15Zm16 0h15v-15H17v15Zm16 0h15v-15H33v15Zm16 0h15v-15H49v15Zm16 0h15v-15H65v15Zm16 0h15v-15H81v15Zm16 0h15v-15H97v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm15-31v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15H97v-15h15Zm-16 0v15H81v-15h15Zm-16 0v15H65v-15h15Zm-16 0v15H49v-15h15Zm-16 0v15H33v-15h15Zm-16 0v15H17v-15h15Zm-16 0v15H1v-15h15Zm-15-1h15v-15H1v15Zm16 0h15v-15H17v15Zm16 0h15v-15H33v15Zm16 0h15v-15H49v15Zm16 0h15v-15H65v15Zm16 0h15v-15H81v15Zm16 0h15v-15H97v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm16 0h15v-15h-15v15Zm15-31v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15h-15v-15h15Zm-16 0v15H97v-15h15Zm-16 0v15H81v-15h15Zm-16 0v15H65v-15h15Zm-16 0v15H49v-15h15Zm-16 0v15H33v-15h15Zm-16 0v15H17v-15h15Zm-16 0v15H1v-15h15Z"
            clipRule="evenodd"
          />
        </svg>
        {/* content */}
        <div className="relative flex h-full items-center px-8 py-2">
          <div className="relative mx-auto flex flex-col gap-2 font-mono text-xs">
            <div className="flex h-16 flex-row items-center gap-5 overflow-hidden rounded-lg border border-sand-12 bg-whiteAlpha-9 px-4 py-2 transition-all duration-150 ease-out hover:h-[5.5rem] hover:bg-whiteAlpha-12">
              <div className="h-8 w-8 flex-none">
                <AstroIcon />
              </div>
              <p>
                <span className="text-sand-11">npm</span> install
                @keystatic/core @keystatic/astro
              </p>
            </div>
            <div className="flex h-16 flex-row items-center gap-5 overflow-hidden rounded-lg border border-sand-12 bg-whiteAlpha-9 px-4 py-2 transition-all duration-150 ease-out hover:h-[5.5rem] hover:bg-whiteAlpha-12">
              <div className="h-8 w-8 flex-none">
                <NextJSIcon />
              </div>
              <p>
                <span className="text-sand-11">npm</span> install
                @keystatic/core @keystatic/next
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    label: 'Connect to GitHub',
    description: 'Learn more about connecting Keystatic to GitHub',
    link: 'docs/connect-to-github',
    bgSVG: (
      <svg
        className="absolute left-1/2 top-1/2 h-96 w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group-hover:scale-125"
        width="324"
        height="184"
        viewBox="0 0 324 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="162"
          cy="91"
          r="48"
          stroke="url(#pattern3-a)"
          strokeWidth="96"
        />
        <path
          stroke="url(#pattern3-b)"
          strokeWidth="96"
          d="M210 91a48 48 0 0 1-72 42"
        />
        <path
          stroke="url(#pattern3-c)"
          strokeWidth="96"
          d="M120 68a48 48 0 0 0 20 66"
        />
        <path
          stroke="url(#pattern3-d)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M324 91H0"
          opacity=".5"
        />
        <path
          stroke="url(#pattern3-e)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M324 139H162"
          opacity=".5"
        />
        <path
          fill="url(#pattern3-f)"
          d="M128 126a48 48 0 0 0 68-68l-68 68Zm68-68L44-94l-68 68 152 152 68-68Z"
          opacity=".5"
        />
        <defs>
          <linearGradient
            id="pattern3-a"
            x1="119"
            x2="210"
            y1="67.3"
            y2="91"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F3C6E2" />
            <stop offset="1" stopColor="#AADEE6" />
          </linearGradient>
          <linearGradient
            id="pattern3-b"
            x1="141.8"
            x2="211.3"
            y1="133"
            y2="92.8"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F9E68C" />
            <stop offset="1" stopColor="#AADEE6" />
          </linearGradient>
          <linearGradient
            id="pattern3-c"
            x1="118.5"
            x2="138.5"
            y1="68"
            y2="132.3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F3C6E2" />
            <stop offset="1" stopColor="#F9E68C" />
          </linearGradient>
          <linearGradient
            id="pattern3-d"
            x1="260"
            x2="65"
            y1="91"
            y2="91"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C4EAEF" />
            <stop offset="1" stopColor="#CEE7FE" />
          </linearGradient>
          <linearGradient
            id="pattern3-e"
            x1="302"
            x2="162"
            y1="139"
            y2="139"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE0A1" />
            <stop offset="1" stopColor="#EDDBF9" />
          </linearGradient>
          <linearGradient
            id="pattern3-f"
            x1="162"
            x2="75.7"
            y1="93.3"
            y2="5.7"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4DEFC" />
            <stop offset="1" stopColor="#FDD8D3" />
          </linearGradient>
        </defs>
      </svg>
    ),
    content: (
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <span className="absolute left-1/2 top-1/2 -ml-10 -mt-10 flex h-20 w-20">
          <span className="invisible absolute inline-flex h-full w-full animate-pulse rounded-full border border-sand-12/40 group-hover:visible group-hover:animate-ping" />
        </span>
        <div className="relative flex w-1/2 flex-row items-center gap-4 transition-all group-hover:w-24">
          <div className="h-8 w-8 flex-none">
            <KeystaticIcon />
          </div>
          <div className="h-[1px] w-full bg-slate-12 transition-all group-hover:w-0" />
          <div className="h-8 w-8 flex-none">
            {/* TODO make GithubIcon component re-sizable and replace below svg */}
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M8 0a8 8 0 0 0-2.529 15.591c.4.074.529-.174.529-.384v-1.49c-2.225.484-2.689-.944-2.689-.944-.364-.924-.888-1.17-.888-1.17-.726-.497.055-.486.055-.486.803.056 1.226.824 1.226.824.713 1.223 1.871.87 2.328.665.071-.517.279-.87.508-1.07-1.777-.203-3.645-.889-3.645-3.953 0-.874.313-1.588.824-2.148-.082-.202-.356-1.016.078-2.117 0 0 .672-.215 2.201.82A7.673 7.673 0 0 1 8 3.868c.68.004 1.365.093 2.004.27 1.527-1.035 2.198-.82 2.198-.82.435 1.102.161 1.916.079 2.117.513.56.823 1.274.823 2.148 0 3.072-1.871 3.749-3.653 3.947.287.248.549.735.549 1.481v2.196c0 .212.128.462.534.384A8.002 8.002 0 0 0 8 0Z"
              />
            </svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'Organised content',
    description:
      'Teach Keystatic how to find and organise the content in your codebase',
    link: '/docs/how-keystatic-organises-your-content',
    bgSVG: (
      <svg
        className="absolute left-1/2 top-1/2 h-96 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group-hover:scale-125"
        width="324"
        height="184"
        viewBox="0 0 324 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="url(#pattern4-a)"
          strokeWidth="96"
          d="M109 226 282 52v-62"
        />
        <path
          stroke="url(#pattern4-b)"
          strokeWidth="96"
          d="M-27 227 186 13v-51"
        />
        <path
          stroke="url(#pattern4-c)"
          strokeWidth="96"
          d="M167 101 88 22v-78"
        />
        <path
          stroke="url(#pattern4-d)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M174 25 6 193"
          opacity=".4"
        />
        <defs>
          <linearGradient
            id="pattern4-a"
            x1="201"
            x2="282"
            y1="147.5"
            y2="51.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4DEFC" />
            <stop offset="1" stopColor="#FDD8D3" />
          </linearGradient>
          <linearGradient
            id="pattern4-b"
            x1="123"
            x2="186"
            y1="71"
            y2="11"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE0A1" />
            <stop offset="1" stopColor="#CEEBCF" />
          </linearGradient>
          <linearGradient
            id="pattern4-c"
            x1="181"
            x2="88"
            y1="115"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4DEFC" />
            <stop offset="1" stopColor="#C4EAEF" />
          </linearGradient>
          <linearGradient
            id="pattern4-d"
            x1="111"
            x2="174"
            y1="83"
            y2="23"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE0A1" />
            <stop offset="1" stopColor="#CEEBCF" />
          </linearGradient>
        </defs>
      </svg>
    ),
    content: (
      <div className="relative h-full px-8">
        <div className="flex h-full flex-col place-content-center gap-2 border-l border-sandAlpha-6 py-2">
          <div className="relative flex flex-row">
            <div className="peer order-2 w-full rounded border border-sand-12 bg-whiteAlpha-9 px-2 py-1 font-mono text-xs leading-tight hover:bg-whiteAlpha-12">
              <p>collection-name</p>
              <p>└── slug</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;├── index.yaml</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;└── other.mdx</p>
            </div>
            <div className="peer z-10 order-1 h-full w-6 flex-none transition-all duration-150 hover:w-12 peer-hover:w-12 " />
            <div className="absolute left-0 top-2 h-[1px] w-6 bg-sandAlpha-6 transition-all duration-150 peer-hover:w-12 peer-hover:bg-gradient-to-l peer-hover:from-sand-12" />
          </div>
          <div className="relative flex flex-row">
            <div className="peer order-2 w-full rounded border border-sand-12 bg-whiteAlpha-9 px-2 py-1 font-mono text-xs leading-tight hover:bg-whiteAlpha-12">
              <p>singleton-name</p>
              <p>├── index.json</p>
              <p>└── other.mdoc</p>
            </div>
            <div className="peer z-10 order-1 w-6 flex-none transition-all duration-150 hover:w-12 peer-hover:w-12 " />
            <div className="absolute left-0 top-2 h-[1px] w-6 bg-sandAlpha-6 transition-all duration-150 peer-hover:w-12 peer-hover:bg-gradient-to-l peer-hover:from-sand-12" />
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'Content structures',
    description: 'Setup Collections and Singletons to edit your content',
    link: '/docs/collections',
    bgSVG: (
      <svg
        className="absolute left-1/2 top-1/2 h-96 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group-hover:scale-125"
        width="324"
        height="184"
        viewBox="0 0 324 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="162"
          cy="93"
          r="48"
          stroke="url(#pattern5-a)"
          strokeWidth="96"
          transform="rotate(-180 162 93)"
        />
        <path
          stroke="url(#pattern5-b)"
          strokeWidth="96"
          d="M114 93a48 48 0 0 1 72-42"
        />
        <path
          stroke="url(#pattern5-c)"
          strokeWidth="96"
          d="M204 116a48 48 0 0 0-20-66"
        />
        <path
          stroke="url(#pattern5-d)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M0 93h324"
          opacity=".5"
        />
        <path
          stroke="url(#pattern5-e)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="M0 45h162"
          opacity=".5"
        />
        <path
          fill="url(#pattern5-f)"
          d="M196 58a48 48 0 1 0-68 68l68-68Zm-68 68 152 152 68-68L196 58l-68 68Z"
          opacity=".5"
        />
        <defs>
          <linearGradient
            id="pattern5-a"
            x1="119"
            x2="210"
            y1="69.3"
            y2="93"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F3C6E2" />
            <stop offset="1" stopColor="#AADEE6" />
          </linearGradient>
          <linearGradient
            id="pattern5-b"
            x1="182.3"
            x2="112.8"
            y1="51"
            y2="91.3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F9E68C" />
            <stop offset="1" stopColor="#AADEE6" />
          </linearGradient>
          <linearGradient
            id="pattern5-c"
            x1="205.5"
            x2="185.5"
            y1="116"
            y2="51.7"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F3C6E2" />
            <stop offset="1" stopColor="#F9E68C" />
          </linearGradient>
          <linearGradient
            id="pattern5-d"
            x1="64"
            x2="259"
            y1="93"
            y2="93"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C4EAEF" />
            <stop offset="1" stopColor="#CEE7FE" />
          </linearGradient>
          <linearGradient
            id="pattern5-e"
            x1="22"
            x2="162"
            y1="45"
            y2="45"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE0A1" />
            <stop offset="1" stopColor="#EDDBF9" />
          </linearGradient>
          <linearGradient
            id="pattern5-f"
            x1="162"
            x2="248.3"
            y1="90.7"
            y2="178.3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E4DEFC" />
            <stop offset="1" stopColor="#FDD8D3" />
          </linearGradient>
        </defs>
      </svg>
    ),
    content: (
      <div className="relative flex h-full items-center px-8 py-2">
        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex w-full flex-col gap-1 rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 font-mono text-xs leading-tight tracking-tight">
            <p>collections:</p>
            <div className="flex w-full flex-col gap-1 rounded border border-dashed border-sand-7 bg-sand-3 px-2 py-1 font-mono text-xs leading-tight transition-all duration-200 ease-in-out group-hover:border-solid group-hover:border-sand-12">
              <p className="text-sand-11 group-hover:text-sand-12">
                testimonials:
              </p>
              <div className="flex w-full flex-col gap-1 rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 font-mono text-xs leading-tight transition-all ease-in-out hover:bg-transparent">
                <p>label:</p>
              </div>
              <div className="flex w-full flex-col gap-1 rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 font-mono text-xs leading-tight transition-all ease-in-out hover:bg-transparent">
                <p>slugField:</p>
              </div>
              <div className="flex w-full flex-col gap-1 rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 font-mono text-xs leading-tight transition-all ease-in-out hover:bg-transparent">
                <p>schema:</p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-1 rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 font-mono text-xs leading-tight tracking-tight">
            <p>singletons:</p>
            <div className="flex w-full flex-col gap-1 rounded border border-dashed border-sand-7 bg-sand-3 px-2 py-1 font-mono text-xs leading-tight transition-all duration-200 ease-in-out hover:border-solid hover:border-sand-12">
              <p className="text-sand-11">settings:</p>
              <div className="flex w-full flex-col gap-1 rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 font-mono text-xs leading-tight transition-all ease-in-out hover:bg-transparent">
                <p>label:</p>
              </div>
              <div className="flex w-full flex-col gap-1 rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 font-mono text-xs leading-tight transition-all ease-in-out hover:bg-transparent">
                <p>schema:</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'Reader API',
    description:
      'Retrieve data from your project directory with the Reader API',
    link: 'docs/reader-api',
    bgSVG: (
      <svg
        className="absolute left-1/2 top-1/2 h-96 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out group-hover:scale-125"
        width="324"
        height="184"
        viewBox="0 0 324 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="url(#pattern6-a)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="m-33-153 458 458"
        />
        <path
          stroke="url(#pattern6-b)"
          strokeWidth="96"
          d="M-40-24 77 93h136l97 98"
        />
        <path
          stroke="url(#pattern6-c)"
          strokeLinejoin="round"
          strokeWidth="96"
          d="m81-38 229 229"
          opacity=".4"
        />
        <defs>
          <linearGradient
            id="pattern6-a"
            x1="-33.2"
            x2="265.6"
            y1="-153"
            y2="145.7"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AADEE6" />
            <stop offset="1" stopColor="#F3C6E2" />
          </linearGradient>
          <linearGradient
            id="pattern6-b"
            x1="71.5"
            x2="272.3"
            y1="87.4"
            y2="288.2"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF8BB" />
            <stop offset="1" stopColor="#D7CFF9" />
          </linearGradient>
          <linearGradient
            id="pattern6-c"
            x1="81.4"
            x2="230.8"
            y1="-38.4"
            y2="110.9"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AADEE6" />
            <stop offset="1" stopColor="#F3C6E2" />
          </linearGradient>
        </defs>
      </svg>
    ),
    content: (
      <div className="relative flex h-full items-center px-8 py-2 font-mono text-xs leading-tight tracking-tight">
        <div className="flex w-full flex-col items-center">
          <div className="relative h-8 w-8 flex-none rounded-full">
            <span className="invisible absolute inline-flex h-full w-full animate-pulse rounded-full bg-sandAlpha-8 group-hover:visible group-hover:animate-ping" />
            <NextJSIcon />
          </div>
          <div className="h-3 w-[1px] bg-sand-12" />
          <div className="min-h-[2.5rem] w-full rounded border border-sand-12 bg-whiteAlpha-12 px-2 py-1 transition-all duration-150 group-hover:bg-whiteAlpha-9 group-hover:text-sand-11">
            <p>
              <span className="text-sand-11">const</span> reader{' '}
              <span className="text-sand-11">=</span> createReader
              {'('}
              process.cwd{'()'}, keystaticConfig{')'};
            </p>
          </div>
          <div className="h-3 w-[1px] bg-sandAlpha-8 group-hover:bg-sand-12" />
          <div className="relative w-full overflow-hidden rounded border border-sandAlpha-8 bg-whiteAlpha-9 transition-all delay-75 group-hover:border-sand-12 group-hover:bg-whiteAlpha-12">
            <svg
              className="visible absolute left-1/2 top-1/2 h-5 w-5 -translate-x-[10px] -translate-y-[10px] scale-100 delay-200 group-hover:invisible group-hover:scale-150"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
                d="M13.75 8.75V5.62a3.75 3.75 0 0 0-7.5 0v3.13m-.62 9.38h8.75a1.87 1.87 0 0 0 1.87-1.88v-5.63a1.88 1.88 0 0 0-1.87-1.87H5.63a1.87 1.87 0 0 0-1.88 1.88v5.62a1.87 1.87 0 0 0 1.88 1.88Z"
              />
            </svg>
            <svg
              className="invisible absolute left-1/2 top-1/2 h-5 w-5 -translate-x-[8px] -translate-y-[10px] scale-100 transition-all delay-200 duration-75 ease-in group-hover:visible group-hover:scale-150"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
                d="M11.25 8.75V5.62a3.75 3.75 0 0 1 7.5 0v3.13M3.12 18.13h8.75a1.87 1.87 0 0 0 1.88-1.88v-5.63a1.87 1.87 0 0 0-1.88-1.87H3.13a1.88 1.88 0 0 0-1.88 1.88v5.62a1.87 1.87 0 0 0 1.88 1.88Z"
              />
            </svg>
            <p className="min-h-[2.5rem] w-full px-2 py-1 opacity-80 blur-sm transition-all delay-300 duration-200 ease-out group-hover:bg-white group-hover:opacity-100 group-hover:blur-none">
              <span className="text-sand-11">const</span> slugs{' '}
              <span className="text-sand-11">=</span> await
              reader().collections.posts.list{'()'};
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function DocsLinks() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-24 pt-12">
        <div className="grid grid-cols-8 gap-6 md:grid-cols-12">
          <div className="col-span-8 text-center sm:col-span-6 sm:col-start-2 md:col-span-8 md:text-left">
            <h2 className="mb-4 text-2xl font-medium">Want to learn more?</h2>
            <p>
              Those sections from the{' '}
              <Link href="/docs" className="underline">
                Keystatic docs
              </Link>{' '}
              are good places to start digging.
            </p>
          </div>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {docs.map(doc => (
            <li key={doc.label} className="group relative">
              <div className="grid h-full grid-rows-1 overflow-hidden rounded-lg border border-sand-6 bg-sand-1 group-hover:border-sand-7">
                <div className="grid h-full grid-rows-[auto,1fr,auto] px-8 py-6">
                  <h3 className="mb-4 text-xl font-medium">{doc.label}</h3>
                  <p className="mb-8">{doc.description}</p>
                  <Link
                    href={doc.link}
                    className="inline-flex items-center gap-1 font-medium text-iris-11 transition-all duration-150 hover:gap-2 hover:text-iris-12"
                  >
                    Read more
                    <ArrowRightIcon />
                  </Link>
                </div>
                <div className="relative h-44 w-full overflow-hidden bg-sand-2">
                  {doc.bgSVG}
                  {doc.content}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
