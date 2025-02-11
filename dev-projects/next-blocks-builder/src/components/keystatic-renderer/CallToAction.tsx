import { InferRenderersForComponentBlocks } from '@keystatic/core';

import { cx } from '../../utils';
import { callToAction } from '../../keystatic/schema/component-blocks';
import { Container } from './Container';
import { ComponentProps } from 'react';

type CallToActionProps = InferRenderersForComponentBlocks<{
  callToAction: typeof callToAction;
}>['callToAction'] &
  ComponentProps<'div'>;

export const CallToAction: CallToActionProps = ({
  layoutProps,
  text,
  buttonText,
  buttonHref,
  ...rest
}) => {
  return (
    <Container layoutProps={layoutProps}>
      <div {...rest} className="not-prose text-center">
        <p
          className={cx(
            'text-xl font-medium @4xl:text-2xl',
            // White
            'surface-white:text-slate-900',
            // Off-white
            'surface-off-white:text-slate-700',
            // Black
            'surface-black:text-transparent surface-black:bg-clip-text surface-black:text-slate-900 surface-black:bg-gradient-to-br surface-black:from-cyan-300 surface-black:to-sky-500 hover:surface-black:from-cyan-200 hover:surface-black:to-sky-400',
            // Off-black
            'surface-off-black:text-slate-200',
            // Splash
            'surface-splash:text-cyan-950'
          )}
        >
          {text}
        </p>
        <div className="mt-10">
          <a
            className={cx(
              'px-8 py-4 font-semibold tracking-wide rounded-md',
              // White
              'surface-white:bg-black surface-white:text-white hover:surface-white:bg-slate-800',
              // Off-white
              'surface-off-white:bg-slate-700 surface-off-white:text-white hover:surface-off-white:bg-slate-600',
              // Black
              'surface-black:text-slate-900 surface-black:bg-gradient-to-br surface-black:from-cyan-300 surface-black:to-sky-500 hover:surface-black:from-cyan-200 hover:surface-black:to-sky-400',
              // Off-black
              'surface-off-black:text-slate-900 surface-off-black:bg-slate-100 hover:surface-off-black:bg-white',
              // Splash
              'surface-splash:text-slate-900 surface-splash:bg-white hover:surface-splash:bg-sky-100'
            )}
            href={buttonHref}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </Container>
  );
};
