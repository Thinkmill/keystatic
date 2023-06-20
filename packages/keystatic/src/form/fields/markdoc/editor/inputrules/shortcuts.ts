export const shortcuts: Record<string, string> = {
  '...': '…',
  '-->': '→',
  '->': '→',
  '<-': '←',
  '<--': '←',
  '--': '–',
};

export const simpleMarkShortcuts = new Map([
  ['bold', ['**', '__']],
  ['italic', ['*', '_']],
  ['strikethrough', ['~~']],
  ['code', ['`']],
] as const);
