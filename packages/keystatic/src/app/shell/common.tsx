import { useProvider } from '@keystar/ui/core';
import { useMediaQuery } from '@keystar/ui/style';

import { serializeRepoConfig } from '../repo-config';
import { useConfig } from './context';

export function useBrand() {
  let { colorScheme } = useProvider();
  let config = useConfig();
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  let brandMark = <ZapLogo />;
  let brandName = 'Keystatic';

  if (config.ui?.brand?.mark) {
    let BrandMark = config.ui.brand.mark;
    let resolvedColorScheme =
      colorScheme === 'auto' ? (prefersDark ? 'dark' : 'light') : colorScheme;

    brandMark = <BrandMark colorScheme={resolvedColorScheme} />;
  }

  if ('repo' in config.storage) {
    brandName = serializeRepoConfig(config.storage.repo);
  }
  if (config.cloud) {
    brandName = config.cloud.project;
  }
  if (config.ui?.brand?.name) {
    brandName = config.ui.brand.name;
  }

  return { brandMark, brandName };
}

function ZapLogo() {
  let id = 'brand-mark-gradient';
  let size = 24;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 8L14 24L12 32L30 14L18 8Z" fill="currentColor" />
      <path d="M2 18L20 0L18 8L2 18Z" fill="currentColor" />
      <path d="M18 8L2 18L14 24L18 8Z" fill={`url(#${id})`} />
      <defs>
        <linearGradient
          id={id}
          x1="2"
          y1="18"
          x2="20"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
    </svg>
  );
}
