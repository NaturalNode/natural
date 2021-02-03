/*
 Copyright (c) 2014, Kristoffer Brabrand

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

'use strict'

/**
 * Remove commonly used diacritic marks from a string as these
 * are not used in a consistent manner. Leave only ä, ö, ü.
 */
const removeDiacritics = function (text) {
  text = text.replace('à', 'a')
  text = text.replace('À', 'A')
  text = text.replace('á', 'a')
  text = text.replace('Á', 'A')
  text = text.replace('â', 'a')
  text = text.replace('Â', 'A')
  text = text.replace('ç', 'c')
  text = text.replace('Ç', 'C')
  text = text.replace('è', 'e')
  text = text.replace('È', 'E')
  text = text.replace('é', 'e')
  text = text.replace('É', 'E')
  text = text.replace('ê', 'e')
  text = text.replace('Ê', 'E')
  text = text.replace('î', 'i')
  text = text.replace('Î', 'I')
  text = text.replace('ñ', 'n')
  text = text.replace('Ñ', 'N')
  text = text.replace('ó', 'o')
  text = text.replace('Ó', 'O')
  text = text.replace('ô', 'o')
  text = text.replace('Ô', 'O')
  text = text.replace('û', 'u')
  text = text.replace('Û', 'U')
  text = text.replace('š', 's')
  text = text.replace('Š', 'S')

  return text
}

// export the relevant stuff.
exports.removeDiacritics = removeDiacritics
