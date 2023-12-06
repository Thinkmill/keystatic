import { Keystatic } from '@keystatic/core/ui';
import { jsx } from 'react/jsx-runtime';

function makePage(config) {
  return function Page() {
    return /*#__PURE__*/jsx(Keystatic, {
      config: config
    });
  };
}

export { makePage };
