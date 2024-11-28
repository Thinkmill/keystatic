// these are intentionally more restrictive than the types allowed by strong and weak maps
type StrongKey = string | number;
type WeakKey = object;

type MemoizeCacheNode = {
  value: unknown;
  strong: Map<StrongKey, MemoizeCacheNode> | undefined;
  weak: WeakMap<WeakKey, MemoizeCacheNode> | undefined;
};

const emptyCacheNode = Symbol('emptyCacheNode');

// weak keys should always come before strong keys in the arguments though that cannot be enforced with types
export function memoize<Args extends readonly (WeakKey | StrongKey)[], Return>(
  func: (...args: Args) => Return
): (...args: Args) => Return {
  const cacheNode: MemoizeCacheNode = {
    value: emptyCacheNode,
    strong: undefined,
    weak: undefined,
  };
  return (...args: Args): Return => {
    let currentCacheNode = cacheNode;
    for (const arg of args) {
      if (typeof arg === 'string' || typeof arg === 'number') {
        if (currentCacheNode.strong === undefined) {
          currentCacheNode.strong = new Map();
        }
        if (!currentCacheNode.strong.has(arg)) {
          currentCacheNode.strong.set(arg, {
            value: emptyCacheNode,
            strong: undefined,
            weak: undefined,
          });
        }
        currentCacheNode = currentCacheNode.strong.get(arg)!;
        continue;
      }
      if (typeof arg === 'object') {
        if (currentCacheNode.weak === undefined) {
          currentCacheNode.weak = new WeakMap();
        }
        if (!currentCacheNode.weak.has(arg)) {
          currentCacheNode.weak.set(arg, {
            value: emptyCacheNode,
            strong: undefined,
            weak: undefined,
          });
        }
        currentCacheNode = currentCacheNode.weak.get(arg)!;
        continue;
      }
    }
    if (currentCacheNode.value !== emptyCacheNode) {
      return currentCacheNode.value as Return;
    }
    const result = func(...args);
    currentCacheNode.value = result;
    return result;
  };
}
