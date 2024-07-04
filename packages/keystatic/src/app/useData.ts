import { useEffect, useMemo, useState } from 'react';
import { MaybePromise } from './utils';
import { weakMemoizeN } from './memo';

export type DataState<T> =
  | { kind: 'loading'; promise: Promise<void> }
  | { kind: 'loaded'; data: T }
  | { kind: 'error'; error: Error };

export const LOADING = {
  then() {},
} as Promise<never>;

function isThenable(value: any): value is Promise<any> {
  return value && typeof value.then === 'function';
}

export function suspendOnData<T>(state: DataState<T>): T {
  if (state.kind === 'error') {
    throw state.error;
  }
  if (state.kind === 'loaded') {
    return state.data;
  }
  throw state.promise;
}

export function useData<T>(func: () => MaybePromise<T>): DataState<T> {
  const result = useMemo(() => {
    try {
      const result = func();
      // this avoids unhandled promise rejections
      // we actually handle the result in an effect
      if (isThenable(result)) {
        result.then(
          () => {},
          () => {}
        );
      }
      return { kind: 'result' as const, result };
    } catch (error) {
      return { kind: 'error' as const, error: error as Error };
    }
  }, [func]);
  const [state, setState] = useState<DataState<T>>((): DataState<T> => {
    return result.kind === 'result'
      ? isThenable(result.result)
        ? { kind: 'loading', promise: result.result as Promise<void> }
        : { kind: 'loaded', data: result.result }
      : result;
  });
  let stateToReturn = state;

  const resultState = useMemo((): DataState<T> | undefined => {
    if (
      result.kind === 'error' &&
      (state.kind !== 'error' || state.error !== result.error)
    ) {
      return { kind: 'error', error: result.error };
    }
    if (
      result.kind === 'result' &&
      !isThenable(result.result) &&
      (state.kind !== 'loaded' || state.data !== result.result)
    ) {
      return { kind: 'loaded', data: result.result as T };
    }
  }, [result, state]);

  if (resultState && resultState !== state) {
    stateToReturn = resultState;
    setState(resultState);
  }

  useEffect(() => {
    if (result.kind === 'result' && isThenable(result.result)) {
      setState({ kind: 'loading', promise: result.result as Promise<void> });
      let isActive = true;
      result.result.then(
        result => {
          if (!isActive) return;
          setState({ kind: 'loaded', data: result });
        },
        error => {
          if (!isActive) return;
          setState({ kind: 'error', error });
        }
      );

      return () => {
        isActive = false;
      };
    }
  }, [result]);

  return stateToReturn;
}

export function mapDataState<Input, Output>(
  state: DataState<Input>,
  func: (data: Input) => Output
): DataState<Output> {
  if (state.kind === 'error' || state.kind === 'loading') {
    return state;
  }
  return { kind: 'loaded', data: func(state.data) };
}

export function mergeDataStates<T extends Record<string, unknown>>(input: {
  [K in keyof T]: DataState<T[K]>;
}): DataState<T> {
  const entries = Object.entries(input) as [keyof T, DataState<any>][];
  for (const [, value] of entries) {
    if (value.kind === 'error') {
      return { kind: 'error', error: value.error };
    }
  }
  let promises: Promise<void>[] = [];
  for (const [, value] of entries) {
    if (value.kind === 'loading') {
      promises.push(value.promise);
    }
  }
  if (promises.length) {
    return {
      kind: 'loading',
      promise: promiseAllMemoized(
        ...promises
      ) as Promise<unknown> as Promise<void>,
    };
  }

  return {
    kind: 'loaded',
    data: Object.fromEntries(
      entries.map(([key, val]) => {
        return [key, (val as typeof val & { kind: 'loaded' }).data];
      })
    ) as T,
  };
}

const promiseAllMemoized = weakMemoizeN((...args: Promise<void>[]) => {
  return Promise.all(args);
});
