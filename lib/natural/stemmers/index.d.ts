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

declare interface RegionsType {
  r1: number
  r2: number
  rv: number
}

export declare interface Stemmer {
  stem: (token: string) => string
  addStopWord: (stopWord: string) => void
  addStopWords: (moreStopWords: string[]) => void
  removeStopWord: (stopWord: string) => void
  removeStopWords: (moreStopWords: string[]) => void
  tokenizeAndStem: (text: string, keepStops?: boolean) => string[]
  regions: (word: string) => RegionsType
  prelude: (token: string) => string
  endsinArr: (token: string, suffixes: string[]) => string
  categorizeGroups: (token: string) => string
  measure: (token: string) => number

  // Exposed for testing purposes:
  step1: (token: string) => string
  step1a: (token: string) => string
  step1b: (token: string) => string
  step1c: (token: string) => string
  step2: (token: string) => string
  step3: (token: string) => string
  step4: (token: string) => string
  step5a: (token: string) => string
  step5b: (token: string) => string
}

export let CarryStemmerFr: Stemmer
export let LancasterStemmer: Stemmer
export let PorterStemmer: Stemmer
export let PorterStemmerDe: Stemmer
export let PorterStemmerEs: Stemmer
export let PorterStemmerFa: Stemmer
export let PorterStemmerFr: Stemmer
export let PorterStemmerIt: Stemmer
export let PorterStemmerNl: Stemmer
export let PorterStemmerNo: Stemmer
export let PorterStemmerPt: Stemmer
export let PorterStemmerUk: Stemmer
export let PorterStemmerRu: Stemmer
export let PorterStemmerSv: Stemmer
export let StemmerId: Stemmer
export let StemmerJa: Stemmer

export declare type TokenCallback = (...args: number[]) => number[] | number

export declare class Token {
  vowels: string[] | string
  regions: Record<string, number>
  string: string
  original: string

  constructor (s: string)
  usingVowels (vowels: string | string[]): Token
  markRegion (region: string, args: number[] | number | null, callback?: TokenCallback, context?: unknown): Token
  replaceAll (find: string, replace: string): Token
  replaceSuffixInRegion (suffix: string, replace: string, region: string): Token
  hasVowelAtIndex (index: number): boolean
  nextVowelIndex (index: number): number
  nextConsonantIndex (index: number): number
  hasSuffix (suffix: string): number
  hasSuffixInRegion (suffix: string, region: string): boolean
}
