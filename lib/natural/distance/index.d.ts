
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

export interface JaroWinklerOptions {
  dj?: number | undefined
  // default: false
  ignoreCase?: boolean | undefined
}
export declare function JaroWinklerDistance (s1: string, s2: string, options: JaroWinklerOptions): number

export interface DamerauLevenshteinDistanceOptions {
  /** @default 1 */
  insertion_cost?: number | undefined
  /** @default 1 */
  deletion_cost?: number | undefined
  /** @default 1 */
  substitution_cost?: number | undefined
  /** @default 1 */
  transposition_cost?: number | undefined
  /** @default false */
  search?: boolean | undefined
  /** @default false */
  restricted?: boolean | undefined
  damerau?: boolean | undefined
}
interface SubstringDistanceResult {
  substring: string
  distance: number
}
export declare function LevenshteinDistance (source: string, target: string, options?: DamerauLevenshteinDistanceOptions): number
/**
 * Returns the Damerau-Levenshtein distance between strings. Counts the distance
 * between two strings by returning the number of edit operations required to
 * convert `source` into `target`.
 *
 * Valid edit operations are:
 *  - transposition, insertion, deletion, and substitution
 */
export function DamerauLevenshteinDistance (
  source: string,
  target: string,
  options: DamerauLevenshteinDistanceOptions & { search: true }
): SubstringDistanceResult
export function DamerauLevenshteinDistance (
  source: string,
  target: string,
  options?: DamerauLevenshteinDistanceOptions & { search?: false | undefined }
): number
export function DamerauLevenshteinDistance (
  source: string,
  target: string,
  options: DamerauLevenshteinDistanceOptions & { search: boolean }
): number | SubstringDistanceResult
export declare function DiceCoefficient (str1: string, str2: string): number
