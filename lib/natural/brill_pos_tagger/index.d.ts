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

export declare class Predicate {
  constructor (name: string, parameter1: string, parameter2?: string)
  name: string
  parameter1: string
  parameter2?: string | undefined
  function?: ((tagged_sentence: string[][], i: number, parameter: string) => boolean) | undefined
  evaluate (taggedSentence: string[][], position: number): boolean
}

export declare class TransformationRule {
  constructor (c1: string, c2: string, predicate: string, parameter1: string, parameter2?: string)
  literal: string[]
  predicate: Predicate
  old_category: string
  new_category: string
  apply (taggedSentence: string[][], position: number): void
}

export declare class RuleSet {
  constructor (filename: string)
  rules: TransformationRule[]
}

export declare class Lexicon {
  constructor (filename: string, defaultCategory: string)
  defaultCategory: string
  parseLexicon (data: string): void
  tagWord (word: string): string[]
}

export interface TaggedWord {
  token: string
  tag: string
}

export declare class Sentence {
  constructor (data?: string[])
  taggedWords: TaggedWord[]
  addTaggedWord (token: string, tag: string): void
  clone (): Sentence
}

export declare class BrillPOSTagger {
  constructor (lexicon: Lexicon, ruleSet: RuleSet)
  lexicon: Lexicon
  ruleSet: RuleSet
  tag (sentence: string[]): Sentence
}
