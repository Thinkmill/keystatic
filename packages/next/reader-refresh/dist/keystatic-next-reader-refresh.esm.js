import 'server-only';
import { Suspense } from 'react';
import { ReaderRefreshClient } from '../../dist/reader-refresh-client-8cd4583c.esm.js';
import { a as getReaderKey, g as getResolvedDirectories } from '../../dist/utils-9dfe1a5b.esm.js';
import { jsx } from 'react/jsx-runtime';
import '@keystatic/core/api/utils';
import 'path';
import 'fs/promises';
import 'crypto';

async function ReaderRefreshInner(props) {
  return /*#__PURE__*/jsx(ReaderRefreshClient, {
    currentKey: await getReaderKey(getResolvedDirectories(props.reader.config, props.reader.repoPath))
  });
}
function ReaderRefresh(props) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  return /*#__PURE__*/jsx(Suspense, {
    fallback: null,
    children: /*#__PURE__*/jsx(ReaderRefreshInner
    //
    , {
      reader: props.reader
    })
  });
}

export { ReaderRefresh };
