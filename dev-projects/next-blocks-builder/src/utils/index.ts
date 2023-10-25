export function cx(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
