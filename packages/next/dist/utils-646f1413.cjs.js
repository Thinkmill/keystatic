'use strict';

var utils = require('@keystatic/core/api/utils');
var path = require('path');
var fs = require('fs/promises');
var crypto = require('crypto');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);
var fs__default = /*#__PURE__*/_interopDefault(fs);

async function getDirKeyComponents(dirpath) {
  return Promise.all((await fs__default["default"].readdir(dirpath, {
    withFileTypes: true
  })).map(async entry => {
    const joined = path__default["default"].join(dirpath, entry.name);
    if (entry.isFile()) {
      const stat = await fs__default["default"].stat(joined);
      return [entry.name, stat.mtimeMs];
    }
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      return [entry.name, await getDirKeyComponents(joined)];
    }
    return null;
  }));
}
function getResolvedDirectories(config, repoPath) {
  const directories = utils.getAllowedDirectories(config);
  const resolvedRepoPath = path__default["default"].resolve(repoPath);
  return directories.map(dir => path__default["default"].join(resolvedRepoPath, dir));
}
async function getReaderKey(directories) {
  const data = JSON.stringify(await Promise.all(directories.map(async dir => {
    return [dir, await getDirKeyComponents(dir)];
  })));
  return crypto.createHash('sha1').update(data).digest('hex');
}

exports.getReaderKey = getReaderKey;
exports.getResolvedDirectories = getResolvedDirectories;
