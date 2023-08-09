import { VoussoirTheme } from '@keystar/ui/style';
import { useLayoutEffect } from 'react';

import { useProvider } from './context';
import { documentElementClasses } from './globals';

export function ClientSideOnlyDocumentElement(props: {
  bodyBackground?: keyof VoussoirTheme['color']['background'];
}) {
  const context = useProvider();
  const classes = documentElementClasses({
    bodyBackground: props.bodyBackground,
    colorScheme: context.colorScheme,
  });
  useLayoutEffect(() => {
    const split = classes.split(' ');
    const root = document.documentElement;
    root.classList.add(...split);
    return () => {
      root.classList.remove(...split);
    };
  }, [classes]);
  return null;
}
