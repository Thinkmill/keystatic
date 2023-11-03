import { Config } from '@keystatic/core';
import { Keystatic } from '@keystatic/core/ui';

export function makePage(config: Config<any, any>) {
  return function Page() {
    return <Keystatic config={config} />;
  };
}
