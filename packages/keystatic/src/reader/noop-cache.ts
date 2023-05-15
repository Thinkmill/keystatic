export function cache<Func extends (...args: any[]) => any>(func: Func): Func {
  return func;
}
