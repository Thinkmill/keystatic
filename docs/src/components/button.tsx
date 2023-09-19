import Link from 'next/link';
import { AllHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { cx } from '../utils';

type ButtonProps = {
  impact?: 'bold' | 'light';
  variant?: 'regular' | 'small';
  href?: string;
  isLoading?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
} & AllHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>;

const baseClasses =
  'block text-center font-semibold leading-none border transition-colors';

const impactClasses: Record<ButtonProps['impact'] & {}, string> = {
  bold: 'bg-indigo-9 text-white hover:bg-indigo-10 active:bg-indigo-11 border-transparent',
  light:
    'bg-white border-sand-7 text-sand-11 hover:bg-sand-2 hover:border-sand-8 active:bg-sand-10',
};

const variantClasses: Record<ButtonProps['variant'] & {}, string> = {
  regular: 'rounded-lg px-4 py-3',
  small: 'rounded-md py-2 px-3 text-sm',
};

// ----------

export default function Button({
  impact = 'bold',
  variant = 'regular',
  href,
  isLoading = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return href ? (
    <Link
      href={href}
      {...props}
      className={cx(
        baseClasses,
        impactClasses[impact],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Link>
  ) : (
    <button
      {...props}
      className={cx(
        baseClasses,
        impactClasses[impact],
        variantClasses[variant],
        className
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

function Spinner() {
  return (
    <div className="grid w-full place-items-center">
      <svg
        className="-my-0.5 h-5 w-5 animate-spin text-sand-1"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
