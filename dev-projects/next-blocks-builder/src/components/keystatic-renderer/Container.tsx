import { cx } from '../../utils';
import type { LayoutProps } from '../../keystatic/schema/layout-props';
import { ComponentProps } from 'react';

export type { LayoutProps };

type ContainerProps = {
  className?: string;
  layoutProps: LayoutProps;
} & ComponentProps<'section'>;

// ----------------------------------
// Style lookups
// ----------------------------------
const marginTopClasses: Record<LayoutProps['marginTop'], string> = {
  large: 'mt-24 md:mt-32 lg:mt-40',
  medium: 'mt-16 md:mt-20 lg:mt-24',
  small: 'mt-8 md:mt-12 lg:mt-16',
  none: '',
};

const surfaceClasses: Record<LayoutProps['surface'], string> = {
  white: 'bg-white',
  'off-white': 'bg-slate-200',
  black: 'bg-black',
  'off-black': 'bg-slate-900',
  splash: 'bg-gradient-to-br from-cyan-400 to-sky-400',
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

// width: 100vw;
//   position: relative;
//   left: 50%;
//   right: 50%;
//   margin-left: -50vw;
//   margin-right: -50vw;

const containerWidthClasses: Record<LayoutProps['containerWidth'], string> = {
  full: 'max-w-none w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]',
  large: 'max-w-big rounded-xl',
  medium: 'max-w-6xl rounded-xl',
  narrow: 'max-w-4xl rounded-xl',
};

const innerContainerClasses: Record<LayoutProps['containerWidth'], string> = {
  full: 'max-w-big mx-auto px-6',
  large: 'px-20',
  medium: 'px-16',
  narrow: 'px-10',
};

// ----------------------------------
// Component
// ----------------------------------
export function Container({
  className = '',
  layoutProps: {
    marginTop = 'none',
    surface = 'white',
    paddingTop = 'large',
    paddingBottom = 'large',
    containerWidth = 'medium',
  },
  children,
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
        '@container', // Container queries!
        'prose surface-inverse:prose-invert',
        'mx-auto',
        marginTopClasses[marginTop],
        surfaceClasses[surface],
        paddingTopClasses[paddingTop],
        paddingBottomClasses[paddingBottom],
        containerWidthClasses[containerWidth],
        className
      )}
    >
      <div className={innerContainerClasses[containerWidth]}>{children}</div>
    </section>
  );
}
