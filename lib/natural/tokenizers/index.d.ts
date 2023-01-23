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

// Based on type definitions on Definitely Typed

export interface Tokenizer {
  tokenize: (text: string) => string[]
}
export declare class WordTokenizer implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class TreebankWordTokenizer implements Tokenizer {
  tokenize (text: string): string[]
}
export interface RegexTokenizerOptions {
  pattern?: RegExp | undefined
  discardEmpty?: boolean | undefined
}
export declare class RegexpTokenizer implements Tokenizer {
  constructor (options: RegexTokenizerOptions)
  tokenize (text: string): string[]
}
export declare class OrthographyTokenizer implements Tokenizer {
  constructor (options: RegexTokenizerOptions & { language: string })
  tokenize (text: string): string[]
}
export declare class WordPunctTokenizer implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class SentenceTokenizer implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class SentenceTokenizerNew implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class CaseTokenizer implements Tokenizer {
  tokenize (text: string, preserveApostrophy?: boolean): string[]
}
export declare class AggressiveTokenizer implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerEs implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerFa implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerFr implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerDe implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerId implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerIt implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerNl implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerNo implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerPl implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerPt implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerRu implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerSv implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class AggressiveTokenizerVi implements Tokenizer {
  tokenize (text: string): string[]
}
export declare class TokenizerJa implements Tokenizer {
  tokenize (text: string): string[]
}
