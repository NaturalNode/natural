/*
Copyright (c) 2022, Dylan R. E. Moonfire <https://github.com/dmoonfire>, Emily Marigold Klassen <https://github.com/forivall>, Hugo W.L. ter Doest

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

// Based on the type definitions on definitely typed

export interface Stemmer {
  stem: (token: string) => string
  tokenizeAndStem: (text: string) => string[]
  attach: () => void
}

declare const CarryStemmerFr: Stemmer
declare const LancasterStemmer: Stemmer
declare const PorterStemmer: Stemmer
declare const PorterStemmerEs: Stemmer
declare const PorterStemmerFa: Stemmer
declare const PorterStemmerFr: Stemmer
declare const PorterStemmerDe: Stemmer
declare const PorterStemmerIt: Stemmer
declare const PorterStemmerNl: Stemmer
declare const PorterStemmerNo: Stemmer
declare const PorterStemmerPt: Stemmer
declare const PorterStemmerRu: Stemmer
declare const PorterStemmerSv: Stemmer
declare const StemmerId: Stemmer
declare const StemmerJa: Stemmer
