import { breakpointQueries, css, tokenSchema } from '@voussoir/style';

export function ZapLogo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={tokenSchema.color.foreground.neutral}
      className={css({
        flexShrink: 0,
        [breakpointQueries.below.tablet]: {
          height: tokenSchema.size.icon.regular,
          width: tokenSchema.size.icon.regular,
        },
      })}
    >
      <path d="M13.3982 1.08274C13.8054 1.25951 14.0473 1.68358 13.9923 2.12407L13.1328 9.00003H21C21.388 9.00003 21.741 9.22449 21.9056 9.57588C22.0702 9.92726 22.0166 10.3421 21.7682 10.6402L11.7682 22.6402C11.484 22.9812 11.009 23.0941 10.6018 22.9173C10.1946 22.7405 9.95267 22.3165 10.0077 21.876L10.8672 15H3.00002C2.612 15 2.25901 14.7756 2.09443 14.4242C1.92985 14.0728 1.9834 13.6579 2.2318 13.3598L12.2318 1.35986C12.516 1.01882 12.991 0.905971 13.3982 1.08274Z" />
    </svg>
  );
}
