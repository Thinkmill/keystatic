import Link from 'next/link';
import { AllHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { cx } from '../utils';
import { GlobeIcon } from './icons/globe';
import { ArrowTopRightIcon } from './icons/arrow-top-right-icon';

type ButtonProps = {
  impact?: 'bold' | 'light';
  href?: string;
  isLoading?: boolean;
  icon?: typeof GlobeIcon;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
} & AllHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>;

const baseClasses =
  'flex rounded-md px-3 py-2 text-center text-sm text-slate-12 font-medium leading-none border transition-colors gap-1 items-center';

const impactClasses: Record<ButtonProps['impact'] & {}, string> = {
  bold: 'bg-white border-slate-5 text-black hover:bg-slate-2',
  light: 'bg-transparent border-transparent text-black hover:border-slate-5',
};

// ----------

export default function ActionButton({
  impact = 'bold',
  href,
  children,
  icon: Icon,
  className = '',
  ...props
}: ButtonProps) {
  return href ? (
    <Link
      href={href}
      {...props}
      className={cx(baseClasses, impactClasses[impact], className)}
    >
      {Icon && <Icon className="text-inherit h-4 w-4" />}
      <span>{children}</span>
      {href.startsWith('http') && <ArrowTopRightIcon />}
    </Link>
  ) : (
    <button
      {...props}
      className={cx(baseClasses, impactClasses[impact], className)}
    >
      {Icon && <Icon className="text-inherit h-4 w-4" />}
      <span>{children}</span>
    </button>
  );
}
