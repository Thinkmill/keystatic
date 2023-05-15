export function cx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
