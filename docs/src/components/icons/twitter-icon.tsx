import { useId } from 'react';

export function TwitterIcon({ ariaHidden = true }: { ariaHidden?: boolean }) {
  const id = `${useId()}-twitter-icon`;

  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      aria-hidden={ariaHidden}
    >
      <g clipPath={`url(#${id})`}>
        <path
          fill="#000"
          d="M16 3.038a6.554 6.554 0 0 1-1.885.517 3.288 3.288 0 0 0 1.443-1.816 6.576 6.576 0 0 1-2.085.796A3.285 3.285 0 0 0 7.88 5.528 9.319 9.319 0 0 1 1.114 2.1a3.287 3.287 0 0 0 1.015 4.383 3.269 3.269 0 0 1-1.486-.41c-.036 1.52 1.054 2.943 2.633 3.26a3.29 3.29 0 0 1-1.483.055 3.285 3.285 0 0 0 3.067 2.28A6.6 6.6 0 0 1 0 13.027 9.293 9.293 0 0 0 5.032 14.5c6.095 0 9.538-5.147 9.33-9.764A6.684 6.684 0 0 0 16 3.038Z"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
