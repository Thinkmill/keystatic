import { VoussoirTheme } from '@voussoir/style';
import { useLayoutEffect } from 'react';
import { documentElementClasses } from './globals';
import { useProvider } from './VoussoirProvider';

export function ClientSideOnlyDocumentElement(props: {
  bodyBackground?: keyof VoussoirTheme['color']['background'];
}) {
  const context = useProvider();
  const classes = documentElementClasses({
    bodyBackground: props.bodyBackground,
    colorScheme: context.colorScheme,
    scale: context.scale,
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
