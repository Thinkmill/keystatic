type CacheNode = { inner: WeakMap<object, CacheNode>; value?: unknown };

export function weakMemoizeN<Fn extends (...rest: any[]) => unknown>(
  fn: Fn
): (...args: Parameters<Fn>) => ReturnType<Fn> {
  const root: CacheNode = { inner: new WeakMap<object, CacheNode>() };
  return function (...args: object[]) {
    let currentCacheNode = root;
    for (const arg of args) {
      const { inner } = currentCacheNode;
      if (!inner.has(arg)) {
        inner.set(arg, { inner: new WeakMap() });
      }
      currentCacheNode = inner.get(arg)!;
    }
    if (!currentCacheNode.hasOwnProperty('value')) {
      currentCacheNode.value = fn(...args);
    }
    return currentCacheNode.value;
  } as any;
}
