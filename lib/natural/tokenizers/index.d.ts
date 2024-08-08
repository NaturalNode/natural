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

declare class Tokenizer {
  trim: (array: string[]) => string[]
}

export class AggressiveTokenizerNl extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerFa extends Tokenizer {
  clearEmptyString (array: string[]): string[]
  clearText (text: string): string
  tokenize (text: string): string[]
}

export class AggressiveTokenizerFr extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerDe extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerRu extends Tokenizer {
  withoutEmpty (array: string[]): string[]
  clearText (text: string): string
  tokenize (text: string): string[]
}

export class AggressiveTokenizerEs extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerIt extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerPl extends Tokenizer {
  withoutEmpty (array: string[]): string[]
  clearText (text: string): string
  tokenize (text: string): string[]
}

export class AggressiveTokenizerPt extends Tokenizer {
  withoutEmpty (array: string[]): string[]
  tokenize (text: string): string[]
}

export class AggressiveTokenizerNo extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerSv extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerVi extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerId extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerHi extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizerUk extends Tokenizer {
  tokenize (text: string): string[]
}

export class AggressiveTokenizer extends Tokenizer {
  tokenize (text: string): string[]
}

export class CaseTokenizer extends Tokenizer {
  tokenize (text: string, preserveApostrophe?: boolean): string[]
}

declare interface RegexTokenizerOptions {
  pattern?: RegExp
  discardEmpty?: boolean
  gaps?: boolean
}

export class RegexpTokenizer extends Tokenizer {
  constructor (opts?: RegexTokenizerOptions)
  tokenize (text: string): string[]
}

declare interface OrthographyTokenizerOptions extends RegexTokenizerOptions {
  language: string
}

export class OrthographyTokenizer extends RegexpTokenizer {
  constructor (options: OrthographyTokenizerOptions)
}

export class WordTokenizer extends RegexpTokenizer {
  constructor (options?: RegexTokenizerOptions)
}

export class WordPunctTokenizer extends RegexpTokenizer {
  constructor (options?: RegexTokenizerOptions)
}

export class TreebankWordTokenizer extends Tokenizer {
  tokenize (text: string): string[]
}

export class TokenizerJa extends Tokenizer {
  removePuncTokens (tokens: string[]): string[]
  tokenize (text: string): string[]
}

export class SentenceTokenizer extends Tokenizer {
  constructor (abbreviations: string[], sentenceDemarkers?: string[])
  tokenize (text: string): string[]
}
