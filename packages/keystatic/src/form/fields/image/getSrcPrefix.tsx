export function getSrcPrefix(
  publicPath: string | undefined,
  slug: string | undefined
) {
  return typeof publicPath === 'string'
    ? `${publicPath.replace(/\/*$/, '')}/${
        slug === undefined ? '' : slug + '/'
      }`
    : '';
}
