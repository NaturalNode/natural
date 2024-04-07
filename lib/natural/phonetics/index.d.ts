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

export class Phonetic<T> {
  compare (stringA: string, stringB: string): boolean
  tokenizeAndPhoneticize (str: string, phoneticsProcessor: Phonetic<T>, keepStops: boolean): T
}

export class Metaphone extends Phonetic<string> {
  dedup (token: string): string
  dropInitialLetters (token: string): string
  dropBafterMAtEnd (token: string): string
  cTransform (token: string): string
  dTransform (token: string): string
  dropG (token: string): string
  transformG (token: string): string
  dropH (token: string): string
  transformCK (token: string): string
  transformPH (token: string): string
  transformQ (token: string): string
  transformS (token: string): string
  transformT (token: string): string
  dropT (token: string): string
  transformV (token: string): string
  transformWH (token: string): string
  dropW (token: string): string
  transformX (token: string): string
  dropY (token: string): string
  transformZ (token: string): string
  dropVowels (token: string): string
  process (token: string, maxLength?: number): string
}

export class SoundEx extends Phonetic<string> {
  process (token: string, maxLength?: number): string
  transformLipps (token: string): string
  transformThroats (token: string): string
  transformToungue (token: string): string
  transformL (token: string): string
  transformHum (token: string): string
  transformR (token: string): string
  condense (token: string): string
  padRight0 (token: string): string
  transform (token: string): string
}

export class DoubleMetaphone extends Phonetic<string[]> {
  process (token: string, maxLength?: number): string[]
  isVowel (c: string): string | RegExpMatchArray | null
}

export class SoundExDM extends Phonetic<string> {
  process (word: string, codeLength?: number): string
}
