'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('server-only');
var react = require('react');
var reader_refresh_client = require('../../dist/reader-refresh-client-4dee7fdb.cjs.js');
var utils = require('../../dist/utils-646f1413.cjs.js');
var jsxRuntime = require('react/jsx-runtime');
require('@keystatic/core/api/utils');
require('path');
require('fs/promises');
require('crypto');

async function ReaderRefreshInner(props) {
  return /*#__PURE__*/jsxRuntime.jsx(reader_refresh_client.ReaderRefreshClient, {
    currentKey: await utils.getReaderKey(utils.getResolvedDirectories(props.reader.config, props.reader.repoPath))
  });
}
function ReaderRefresh(props) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  return /*#__PURE__*/jsxRuntime.jsx(react.Suspense, {
    fallback: null,
    children: /*#__PURE__*/jsxRuntime.jsx(ReaderRefreshInner
    //
    , {
      reader: props.reader
    })
  });
}

exports.ReaderRefresh = ReaderRefresh;
