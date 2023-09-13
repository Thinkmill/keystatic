import { useId } from 'react';

export function KeystaticIcon({ ariaHidden = true }: { ariaHidden?: boolean }) {
  const id = `${useId()}-keystatic-icon`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 32 32"
      aria-hidden={ariaHidden}
    >
      <path fill="#1B1B18" d="M20 0 2 18l12 6 6-24ZM12 32l18-18-12-6-6 24Z" />
      <path fill={`url(#${id})`} d="M18 8 2 18l12 6 4-16Z" />
      <defs>
        <linearGradient
          id={id}
          x1="2"
          x2="20"
          y1="18"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C8C7C1" />
          <stop offset="1" stopColor="#1B1B18" />
        </linearGradient>
      </defs>
    </svg>
  );
}
