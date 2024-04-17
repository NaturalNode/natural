/*
Copyright (c) 2011, Chris Umbel

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

'use strict'

import { JaroWinklerDistance } from 'lib/natural'

/*
Do not change the prototype of native types
Number.prototype.approxEql = function (val) {
  return Math.abs(this - val) < 1e-5
}
*/

function approxEql (val1: number, val2: number): boolean {
  return Math.abs(val1 - val2) < 1e-5
}

describe('jaro-winkler', function () {
  it('should evaluate string similarity', function () {
    expect(approxEql(JaroWinklerDistance('DIXON', 'DICKSONX', {}), 0.81333)).toBeTruthy()
    expect(approxEql(JaroWinklerDistance('DWAYNE', 'DUANE', {}), 0.84)).toBeTruthy()
  })

  it('should handle exact matches', function () {
    expect(JaroWinklerDistance('RICK', 'RICK', {})).toBe(1)
    expect(JaroWinklerDistance('abc', 'abc', {})).toBe(1)
    expect(JaroWinklerDistance('abcd', 'abcd', {})).toBe(1)
    expect(JaroWinklerDistance('seddon', 'seddon', {})).toBe(1)
  })

  it('should handle total mis-matches', function () {
    expect(JaroWinklerDistance('NOT', 'SAME', {})).toBe(0)
  })

  it('should handle partial mis-matches', function () {
    expect(approxEql(JaroWinklerDistance('aaa', 'abcd', {}), 0.575)).toBeTruthy()
  })

  it('should handle transpositions', function () {
    expect(approxEql(JaroWinklerDistance('MARTHA', 'MARHTA', {}), 0.96111)).toBeTruthy()
  })

  it('should handle transpositions regardless of string order', function () {
    expect(approxEql(JaroWinklerDistance('class', 'clams', {}), 0.90666)).toBeTruthy()
    expect(approxEql(JaroWinklerDistance('clams', 'class', {}), 0.90666)).toBeTruthy()
  })

  it('should ignore case when asked to', function () {
    expect(JaroWinklerDistance('aaa', 'aAa', { ignoreCase: true })).toEqual(JaroWinklerDistance('aaa', 'aaa', {}))
    expect(JaroWinklerDistance('aaa', 'aAa', {})).not.toEqual(JaroWinklerDistance('aaa', 'aaa', {}))
    expect(JaroWinklerDistance('dixon', 'DICKSONX', { ignoreCase: true })).toEqual(JaroWinklerDistance('DIXON', 'DICKSONX', {}))
    expect(JaroWinklerDistance('seddon', 'SEDDON', { ignoreCase: true })).toEqual(JaroWinklerDistance('SEDDON', 'SEDDON', {}))
    expect(approxEql(JaroWinklerDistance('MARTHA', 'MARHTA', { ignoreCase: true }), 0.96111)).toBeTruthy()
    expect(JaroWinklerDistance('abcd', 'ABCD', { ignoreCase: true })).toBe(1)
  })
  it('should not fail while passing no options', function () {
    expect(approxEql(JaroWinklerDistance('check', 'chakk'), 0.78666)).toBeTruthy()
  })
})
