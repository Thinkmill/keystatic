import React from 'react';
import { Config } from '@itgkey/core';
import { Keystatic as GenericKeystatic } from '@itgkey/core/ui';

const appSlug = {
  envName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  value: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
};

export function makePage(config: Config<any, any>) {
  return function Keystatic() {
    return <GenericKeystatic config={config} appSlug={appSlug} />;
  };
}

