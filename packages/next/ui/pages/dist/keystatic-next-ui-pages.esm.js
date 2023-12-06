import { Keystatic } from '@keystatic/core/ui';
import { jsx } from 'react/jsx-runtime';

function makePage(config) {
  return function Page() {
    return /*#__PURE__*/jsx(Keystatic, {
      config: config,
      appSlug: appSlug
    });
  };
}
const appSlug = {
  envName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  value: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
};

export { makePage };
