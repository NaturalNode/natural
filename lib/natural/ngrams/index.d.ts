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

import type { Tokenizer } from '../tokenizers'

declare interface NGramsStats {
  ngrams: string[][]
  frequencies: Record<string, number>
  Nr: Record<number, number>
  numberOfNgrams: number
}

declare interface NGramsFunctions {
  // To support function overloads where the return type can differ depending on a parameter
  // value, method signatures are necessary. Key collisions occur with property signatures.
  /* eslint-disable @typescript-eslint/method-signature-style */
  setTokenizer (t: Tokenizer): void
  ngrams (sequence: string | string[], n: number, startSymbol: string | undefined | null, endSymbol: string | undefined | null, stats: true): NGramsStats
  ngrams (sequence: string | string[], n: number, startSymbol?: string | undefined | null, endSymbol?: string, stats?: boolean): string[][]
  bigrams (sequence: string | string[], startSymbol: string | undefined, endSymbol: string | undefined, stats: true): NGramsStats
  bigrams (sequence: string | string[], startSymbol?: string, endSymbol?: string, stats?: boolean): string[][]
  trigrams (sequence: string | string[], startSymbol: string | undefined, endSymbol: string | undefined, stats: true): NGramsStats
  trigrams (sequence: string | string[], startSymbol?: string, endSymbol?: string, stats?: boolean): string[][]
  multrigrams (sequence: string | string[], n: number, startSymbol: string | undefined, endSymbol: string | undefined, stats: true): NGramsStats
  multrigrams (sequence: string | string[], n: number, startSymbol?: string, endSymbol?: string, stats?: boolean): string[][]
  /* eslint-enable @typescript-eslint/method-signature-style */
}

export let NGrams: NGramsFunctions
export let NGramsZH: NGramsFunctions
