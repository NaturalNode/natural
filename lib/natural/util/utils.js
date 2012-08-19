/**
 * Generate a replacing function given a table of patterns. Inspired by:
 * http://code.google.com/p/jslibs/wiki/JavascriptTips#String_converter
 * The order of elements is significant. Longer elements should be listed first.
 *
 * @param {Object.<string, string>} translationTable The translation table of key value.
 * @return {function(string): string} A translating function.
 */
function Replacer(translationTable) {
  /**
   * An array of translationTable keys.
   * @type {Array.<string>}
   */
  var pattern = [];

  /**
   * The regular expression doing the replacement job.
   * @type {RegExp}
   */
  var regExp;

  /**
   * Used to iterate over translationTable.
   * @type {string}
   */
  var key;

  for (key in translationTable) {
    // Escaping regexp special chars.
    key = key.replace(/(\^|\$|\*|\+|\?|\.|\(|\)|\[|\]|\{|\}|\||\\)/g, '\\\$1');
    pattern.push(key);
  }

  regExp = new RegExp(pattern.join('|'), 'g');

  /**
   * @param {string} str Input string.
   * @return {string} The string replaced.
   */
  return function(str) {
    return str.replace(regExp, function(str) {
      return translationTable[str];
    });
  };
}


/**
 * Exchanges all keys with their associated values in an object.
 *
 * @param {Object.<string, string>} obj An object of strings.
 * @return {Object.<string, string>} An object of strings.
 */
function flip(obj) {
  var newObj = Object.create(null),
      key;

  for (key in obj) {
    newObj[obj[key]] = key;
  }

  return newObj;
}


/**
 * Merge several objects. Properties from earlier objects are overwritten by
 * laters's in case of conflict.
 *
 * @param {...Object.<string, string>} var_args One or more objects of strings.
 * @return {!Object.<string, string>} An object of strings.
 */
function merge(var_args) {
  var args = [].slice.call(arguments),
      newObj = Object.create(null),
      id = 0, key;

  while (args[id]) {
    for (key in args[id]) {
      newObj[key] = args[id][key];
    }

    id++;
  }

  return newObj;
}

exports.Replacer = Replacer;
exports.flip = flip;
exports.merge = merge;
