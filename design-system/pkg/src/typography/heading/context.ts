import { createContext, useContext } from 'react';

import { FontSizeHeading } from '@keystar/ui/style';

type HeadingContextType = { size: FontSizeHeading };

export const HeadingContext = createContext<HeadingContextType | undefined>(
  undefined
);

export function useHeadingContext() {
  return useContext(HeadingContext);
}
