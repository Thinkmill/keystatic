'use strict';

var sanitizeUrl = require('@braintree/sanitize-url');

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
  return url === sanitizeUrl.sanitizeUrl(url);
}

exports.NAVIGATION_DIVIDER_KEY = NAVIGATION_DIVIDER_KEY;
exports.collection = collection;
exports.config = config;
exports.isValidURL = isValidURL;
exports.singleton = singleton;
