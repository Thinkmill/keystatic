import { cx } from '@/utils';

import type { LayoutProps } from '@/keystatic/schema/layout-props';

export type { LayoutProps };

type ContainerProps = {
  className?: string;
  layoutProps: LayoutProps;
} & React.ComponentProps<'section'>;

// ----------------------------------
// Style lookups
// ----------------------------------
const surfaceClasses: Record<LayoutProps['surface'], string> = {
  white: 'bg-white',
  'off-white': 'bg-slate-200',
  black: 'bg-black',
  'off-black': 'bg-slate-900',
  splash: 'bg-gradient-to-br from-lime-400 to-emerald-400',
};

const paddingTopClasses: Record<LayoutProps['paddingTop'], string> = {
  large: 'pt-24 md:pt-32 lg:pt-40',
  medium: 'pt-16 md:pt-20 lg:pt-24',
  small: 'pt-8 md:pt-12 lg:pt-16',
  none: '',
};

const paddingBottomClasses: Record<LayoutProps['paddingBottom'], string> = {
  large: 'pb-24 md:pb-32 lg:pb-40',
  medium: 'pb-16 md:pb-20 lg:pb-24',
  small: 'pb-8 md:pb-12 lg:pb-16',
  none: '',
};

const containerWidthClasses: Record<LayoutProps['containerWidth'], string> = {
  full: 'max-w-none',
  narrow: 'max-w-3xl',
  normal: 'max-w-7xl',
};

// ----------------------------------
// Component
// ----------------------------------
export function Container({
  className = '',
  layoutProps: {
    surface = 'white',
    paddingTop = 'large',
    paddingBottom = 'large',
    containerWidth = 'normal',
  },
  ...rest
}: ContainerProps) {
  return (
    <section
      data-surface={surface}
      data-inverse={
        surface === 'black' || surface === 'off-black' ? true : false
      }
      {...rest}
      className={cx(
        'group/surface p-12',
        'prose max-w-none surface-inverse:prose-invert',
        surfaceClasses[surface],
        paddingTopClasses[paddingTop],
        paddingBottomClasses[paddingBottom],
        containerWidthClasses[containerWidth],
        className
      )}
    />
  );
}
