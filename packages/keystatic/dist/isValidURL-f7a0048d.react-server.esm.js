import { sanitizeUrl } from '@braintree/sanitize-url';

// Common
// ----------------------------------------------------------------------------
// Interface
// ----------------------------------------------------------------------------
const NAVIGATION_DIVIDER_KEY = '---';

// Storage
// ----------------------------------------------------------------------------
// ============================================================================
// Functions
// ============================================================================
function config(config) {
  return config;
}
function collection(collection) {
  return collection;
}
function singleton(collection) {
  return collection;
}

function isValidURL(url) {
  return url === sanitizeUrl(url);
}

export { NAVIGATION_DIVIDER_KEY as N, collection as a, config as c, isValidURL as i, singleton as s };
