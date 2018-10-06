/*
Copyright (c) 2018, Hugo W.L. ter Doest
Global configuration settings of natural

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Module for managing "global" variables like language

const DEBUG = false;

// Meaning that one of the modules supports the language
// Two letter codes are from
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
var availableLanguages = [
  "CA", // Catalan
  "EN", // English
  "ES", // Spanish
  "EU", // Basque
  "FA", // Farsi
  "FR", // French
  "GL", // Galician
  "ID", // Indonesian
  "IT", // Italian
  "JA", // Japanese
  "NL", // Dutch
  "NO", // Norwegian
  "PL", // Polish
  "PT", // Portuguese
  "RU", // Russian
  "SV", // Swedish
  "VI"  // Vietnamese
];

var DATA = {};

exports.setProperty = function (key, value) {
  DATA[key] = value;
};

exports.getProperty = function(key) {
  return DATA[key];
};

// Sets the language only if available
exports.setLanguage = function(language) {
  if (availableLanguages.indexOf(language) > -1) {
    DEBUG && console.log('Set language to: ' + language);
    DATA["language"] = language;
    return true;
  }
  else {
    DEBUG && console.log('Language not supported: ' + language);
    return false;
  }
};

// Returns the current language
exports.getLanguage = function() {
  DEBUG && console.log('Get language: ' + DATA["language"] )
  return DATA["language"];
};

exports.availableLanguages = function() {
  return availableLanguages;
};