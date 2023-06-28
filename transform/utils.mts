export function replaceImports(content: string) {
  return content
    .replace(/@voussoir\/storybook/g, '@keystar/ui-storybook')
    .replace(/@voussoir\//g, '@keystar/ui/');
}

export function sortObjByKeys<Val>(
  obj: Record<string, Val>
): Record<string, Val> {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))
  );
}
