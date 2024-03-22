/*
Copyright (c) 2022,
Dylan R. E. Moonfire <https://github.com/dmoonfire>,
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

declare type TfIdfCallback = (i: number, measure: number, key?: string | Record<string, any>) => void

declare interface TfIdfTerm {
  term: string
  tf: number
  idf: number
  tfidf: number
}

declare type TfIdfDocument = Record<string, number>

export class TfIdf {
  documents: TfIdfDocument[]
  _idfCache: Record<string, number>

  constructor (deserialized?: Record<string, unknown>)
  idf (term: string, force?: boolean): number
  addDocument (document: string | string[] | Record<string, string>, key?: Record<string, any> | any, restoreCache?: boolean): void
  addFileSync (path: string, encoding?: string, key?: string, restoreCache?: boolean): void
  tfidf (terms: string | string[], d: number): number
  tfidfs (terms: string | string[], callback?: TfIdfCallback): number[]
  listTerms (d: number): TfIdfTerm[]
  setTokenizer (t: Tokenizer): void
  setStopwords (customStopwords: string[]): boolean
  static tf (term: string, document: TfIdfDocument): number
}
