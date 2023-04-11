import 'server-only';
import { Suspense } from 'react';
import { Reader } from '@keystatic/core/reader';
import { ReaderRefreshClient } from './reader-refresh-client';
import { getReaderKey, getResolvedDirectories } from './utils';

async function ReaderRefreshInner(props: { reader: Reader<any, any> }) {
  return (
    <ReaderRefreshClient
      currentKey={await getReaderKey(
        getResolvedDirectories(props.reader.config, props.reader.repoPath)
      )}
    />
  );
}

export function ReaderRefresh(props: { reader: Reader<any, any> }) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  return (
    <Suspense fallback={null}>
      {/* @ts-ignore */}
      <ReaderRefreshInner
        //
        reader={props.reader}
      />
    </Suspense>
  );
}
