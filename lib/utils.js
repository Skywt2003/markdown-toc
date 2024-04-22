'use strict';

/**
 * Module dependencies
 */

var diacritics = require('diacritics-map');

/**
 * Lazily required module dependencies
 */

const utils = {
  concat: require("concat-stream"),
  matter: require("gray-matter"),
  li: require("list-item"),
  mdlink: require("markdown-link"),
  minimist: require("minimist"),
  merge: require("mixin-deep"),
  pick: require("object.pick"),
  Remarkable: require("remarkable"),
  repeat: require("repeat-string"),
  stripColor: require("strip-color"),
};

/**
 * Get the "title" from a markdown link
 */

utils.getTitle = function(str) {
  if (/^\[[^\]]+\]\(/.test(str)) {
    var m = /^\[([^\]]+)\]/.exec(str);
    if (m) return m[1];
  }
  return str;
};

/**
 * Slugify the url part of a markdown link.
 *
 * @name  options.slugify
 * @param  {String} `str` The string to slugify
 * @param  {Object} `options` Pass a custom slugify function on `options.slugify`
 * @return {String}
 * @api public
 */

utils.slugify = function(str, options) {
  options = options || {};
  if (options.slugify === false) return str;
  if (typeof options.slugify === 'function') {
    return options.slugify(str, options);
  }

  str = utils.getTitle(str);
  str = utils.stripColor(str);
  str = str.toLowerCase();

  // `.split()` is often (but not always) faster than `.replace()`
  str = str.split(' ').join('-');
  str = str.split(/\t/).join('--');
  if (options.stripHeadingTags !== false) {
    str = str.split(/<\/?[^>]+>/).join('');
  }
  str = str.split(/[|$&`~=\\\/@+*!?({[\]})<>=.,;:'"^]/).join('');
  str = str.split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/).join('');
  str = replaceDiacritics(str);
  if (options.num) {
    str += '-' + options.num;
  }
  return str;
};

function replaceDiacritics(str) {
  return str.replace(/[À-ž]/g, function(ch) {
    return diacritics[ch] || ch;
  });
}

/**
 * Expose `utils` modules
 */

module.exports = utils;
