import React from 'react';

type Scope = { [key: string]: unknown };

type RenderLiveCodeProps = {
  code: string;
  scope: Scope;
  location: string;
};

function Inner(props: RenderLiveCodeProps) {
  const scopeKeys = Object.keys(props.scope);
  const scopeValues = Object.values(props.scope);
  const res = new Function('React', ...scopeKeys, props.code);
  try {
    return res(React, ...scopeValues);
  } catch (err) {
    throw new Error(
      `An error occurred while running the code example at ${props.location}\n${err}`
    );
  }
}

export function RenderLiveCode(props: RenderLiveCodeProps) {
  return (
    <Inner
      // we want to re-mount when the code changes
      // since hooks might have been added or removed or etc.
      key={props.code}
      {...props}
    />
  );
}
