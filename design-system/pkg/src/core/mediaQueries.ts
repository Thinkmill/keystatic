import { useMediaQuery } from '@keystar/ui/style';

// FANTASY API
export type ColorScheme = 'light' | 'dark';
export type Scale = 'medium' | 'large';

export function useColorScheme(defaultColorScheme?: ColorScheme): ColorScheme {
  let matchesDark = useMediaQuery('(prefers-color-scheme: dark)');
  let matchesLight = useMediaQuery('(prefers-color-scheme: light)');

  // importance OS > default > omitted

  if (matchesDark) {
    return 'dark';
  }

  if (matchesLight) {
    return 'light';
  }

  if (defaultColorScheme === 'dark') {
    return 'dark';
  }

  if (defaultColorScheme === 'light') {
    return 'light';
  }

  return 'light';
}

export function useScale(): Scale {
  let matchesFine = useMediaQuery('(any-pointer: fine)');

  return !matchesFine ? 'large' : 'medium';
}
