import React from 'react';

/**
 * A thin wrapper around `React.useId()` that supports a consumer provided ID.
 */
export function useId(id?: string) {
  let generatedId = React.useId();
  return id || generatedId;
}
