import { cx } from '@/utils';

export type SurfaceProps =
  | 'light'
  | 'light-subtle'
  | 'dark'
  | 'dark-subtle'
  | 'splash';

// type SharedLayoutProps = {
// paddingTop: 'large' | 'medium' | 'small' | 'none'
// paddingBottom: 'large' | 'medium' | 'small' | 'none'
// width: 'narrow' | 'normal'
// }

type SurfaceContainerProps = {
  surface: SurfaceProps;
} & React.ComponentProps<'section'>;

const surfaceClasses: Record<SurfaceProps, string> = {
  light: 'bg-white',
  'light-subtle': 'bg-slate-200',
  dark: 'bg-black',
  'dark-subtle': 'bg-slate-900',
  splash: 'bg-gradient-to-br from-lime-400 to-emerald-400',
};

// const paddingTopClasses: Record<SharedLayoutProps['paddingTop'], string> = {
//   large: 'pt-24 md:pt-32 lg:pt-40',
//   medium: 'pt-16 md:pt-20 lg:pt-24',
//   small: 'pt-8 md:pt-12 lg:pt-16',
//   none: '',
// }

// const paddingBottomClasses: Record<SharedLayoutProps['paddingBottom'], string> = {
//   large: 'pb-24 md:pb-32 lg:pb-40',
//   medium: 'pb-16 md:pb-20 lg:pb-24',
//   small: 'pb-8 md:pb-12 lg:pb-16',
//   none: '',
// }

// const widthClasses: Record<SharedLayoutProps['width'], string> = {
//   narrow: 'max-w-3xl',
//   normal: 'max-w-7xl',
// }

export function SurfaceContainer({
  className = '',
  surface,
  ...rest
}: SurfaceContainerProps) {
  return (
    <section
      data-surface={surface}
      data-inverse={
        surface === 'dark' || surface === 'dark-subtle' ? true : false
      }
      {...rest}
      className={cx(
        'group/surface p-12',
        'prose max-w-none surface-inverse:prose-invert',
        surfaceClasses[surface],
        // paddingTopClasses[sharedLayoutProps.paddingTop],
        // paddingBottomClasses[sharedLayoutProps.paddingBottom],
        // widthClasses[sharedLayoutProps.width],
        className
      )}
    />
  );
}
