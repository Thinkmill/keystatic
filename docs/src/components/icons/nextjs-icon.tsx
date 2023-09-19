import { useId } from 'react';

export function NextJSIcon({ ariaHidden = true }: { ariaHidden?: boolean }) {
  const id1 = `${useId()}-nextjs-icon`;
  const id2 = `${useId()}-nextjs-icon`;
  const id3 = `${useId()}-nextjs-icon`;

  return (
    <svg
      className="relative"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 32 32"
      aria-hidden={ariaHidden}
    >
      <g clipPath={`url(#${id1})`}>
        <path
          fill="currentColor"
          d="M16 32a16 16 0 1 0 0-32 16 16 0 0 0 0 32Z"
        />
        <path
          fill={`url(#${id2})`}
          d="M26.58 28 12.29 9.6H9.6v12.8h2.15V12.32L24.9 29.31c.6-.4 1.16-.84 1.69-1.3Z"
        />
        <path fill={`url(#${id3})`} d="M22.58 9.6h-2.13v12.8h2.13V9.6Z" />
      </g>
      <defs>
        <linearGradient
          id={id2}
          x1="19.38"
          x2="25.69"
          y1="20.71"
          y2="28.53"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={id3}
          x1="21.51"
          x2="21.48"
          y1="9.6"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id1}>
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
