import * as React from 'react';
import { cache as noopCache } from './noop-cache';

// we conditionally using it since it's not actually in stable react releases yet
// (though it should be unnecessary since this file is only imported in react-server environments anyway)
// it's a function because some tools try to be smart with accessing things on namespace imports
// and error at build time if you try to read an export that doesn't exist on a namespace object
function getCache(react: any): typeof noopCache {
  return react.cache ?? noopCache;
}

export const cache: typeof noopCache = getCache(React);
