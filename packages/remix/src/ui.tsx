import { Config } from '@itgkey/core';
import { Keystatic } from '@itgkey/core/ui';

export function makePage(config: Config<any, any>) {
  return function Page() {
    return <Keystatic config={config} />;
  };
}

