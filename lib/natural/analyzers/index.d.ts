/*
Copyright (c) 2022,
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

export declare interface TaggedWord {
  [key: string]: string
  token: string
  pos: string
  spos?: string
  added?: boolean
}

export declare type PunctuationFunction = () => string[] | ''

export declare interface TaggedSentence {
  tags: TaggedWord[]
  punct?: PunctuationFunction
}

export declare type CallbackFunction = (obj: SentenceAnalyzer) => void

export declare type SenType = string

export declare class SentenceAnalyzer {
  posObj: TaggedSentence
  senType: string | null

  constructor (pos: TaggedSentence, cbf: CallbackFunction)
  part (cbf: CallbackFunction): void
  prepositionPhrases (): void
  subjectToString (): string | null
  predicateToString (): string | null
  implicitYou (): boolean
  toString (): string
  type (cbf: CallbackFunction): SenType
}
