import { SVGProps } from 'react';

export type IconProps = {
  ariaHidden?: boolean;
} & SVGProps<SVGSVGElement>;

export function ArrowTopRightIcon({
  ariaHidden = true,
  ...restProps
}: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.8047 4.19526C12.0651 4.45561 12.0651 4.87772 11.8047 5.13807L5.13807 11.8047C4.87772 12.0651 4.45561 12.0651 4.19526 11.8047C3.93491 11.5444 3.93491 11.1223 4.19526 10.8619L10.8619 4.19526C11.1223 3.93491 11.5444 3.93491 11.8047 4.19526Z"
        fill="#1E1E1E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4.66667C4 4.29848 4.29848 4 4.66667 4H11.3333C11.7015 4 12 4.29848 12 4.66667V11.3333C12 11.7015 11.7015 12 11.3333 12C10.9651 12 10.6667 11.7015 10.6667 11.3333V5.33333H4.66667C4.29848 5.33333 4 5.03486 4 4.66667Z"
        fill="#1E1E1E"
      />
    </svg>
  );
}
