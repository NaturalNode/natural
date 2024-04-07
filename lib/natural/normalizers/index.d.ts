/*
Copyright (c) 2022, Dylan R. E. Moonfire <https://github.com/dmoonfire>,
Emily Marigold Klassen <https://github.com/forivall>,
Hugo W.L. ter Doest <https://github.com/Hugo-ter-Doest>

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

export function normalize (tokens: string | string[]): string[]
// eslint-disable-next-line @typescript-eslint/naming-convention
export function normalizeJa (str: string): string
export function normalizeNo (str: string): string
export function normalizeSv (str: string): string
export function removeDiacritics (str: string): string

export class Converters {
  alphabetFH: (str: string) => string
  alphabetHF: (str: string) => string
  numbersFH: (str: string) => string
  numbersHF: (str: string) => string
  punctuationFH: (str: string) => string
  punctuationHF: (str: string) => string
  symbolFH: (str: string) => string
  symbolHF: (str: string) => string
  purePunctuationFH: (str: string) => string
  purePunctuationHF: (str: string) => string
  katakanaFH: (str: string) => string
  katakanaHF: (str: string) => string
  static fixFullwidthKana: (str: string) => string
  static normalize: (str: string) => string
  hiraganaToKatakana (str: string): string
  katakanaToHiragana (str: string): string
}

type FixCompositeSymbolsTable = Record<string, string>
