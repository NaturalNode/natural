/*
Copyright (c) 2011, Chris Umbel, Martijn de Boer, Damien van Holten

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

// a list of commonly used words that have little meaning and can be excluded
// from analysis.
// This dutch wordlist has been parsed from a list created by Damien van Holten
// source: http://www.damienvanholten.com/blog/dutch-stop-words/
var words = [
    'aan', 'af', 'al', 'alles', 'als', 'altijd', 'andere', 'ben', 'bij', 'daar',
    'dan', 'dat', 'de', 'der', 'deze', 'die', 'dit', 'doch', 'doen', 'door', 'dus',
    'een', 'eens', 'en', 'er', 'ge', 'geen', 'geweest', 'haar', 'had', 'heb',
    'hebben', 'heeft', 'hem', 'het', 'hier', 'hij', 'hoe', 'hun', 'iemand', 'iets',
    'ik', 'in', 'is', 'ja', 'je ', 'kan', 'kon', 'kunnen', 'maar', 'me', 'meer',
    'men', 'met', 'mij', 'mijn', 'moet', 'na', 'naar', 'niet', 'niets', 'nog', 'nu',
    'of', 'om', 'omdat', 'ons', 'ook', 'op', 'over', 'reeds', 'te', 'tegen', 'toch',
    'toen', 'tot', 'u', 'uit', 'uw', 'van', 'veel', 'voor', 'want', 'waren', 'was',
    'wat', 'we', 'wel', 'werd', 'wezen', 'wie', 'wij', 'wil', 'worden', 'zal', 'ze',
    'zei', 'zelf', 'zich', 'zij', 'zijn', 'zo', 'zonder', 'zou',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '$', '1',
    '2', '3', '4', '5', '6', '7', '8', '9', '0', '_', '-'];

// tell the world about the noise words.
exports.words = words;
