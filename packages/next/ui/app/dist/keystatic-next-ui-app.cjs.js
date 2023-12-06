'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ui = require('@keystatic/core/ui');
var jsxRuntime = require('react/jsx-runtime');

function makePage(config) {
  return function Page() {
    return /*#__PURE__*/jsxRuntime.jsx(ui.Keystatic, {
      config: config,
      appSlug: appSlug
    });
  };
}
const appSlug = {
  envName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  value: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
};

exports.makePage = makePage;
