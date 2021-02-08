/*
Copyright (c) 2014 Ken Koch

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

const Trie = require('../lib/natural/trie').Trie

describe('trie', function () {
  describe('adding strings', function () {
    it('should add words one at a time', function () {
      const trie = new Trie()
      trie.addString('test')
      expect(trie.contains('test')).toBe(true)

      trie.addString('abcd')
      expect(trie.contains('abcd')).toBe(true)
    })

    it('should return true if a string is added that already existed', function () {
      const trie = new Trie()
      expect(trie.addString('test')).toBe(false)
      expect(trie.addString('test')).toBe(true)
    })

    it('Should add an array of strings', function () {
      const trie = new Trie()
      const testWords = ['test', 'abcd', 'ffff']
      trie.addStrings(testWords)

      for (let i = testWords.length - 1; i >= 0; i--) {
        expect(trie.contains(testWords[i])).toBe(true)
      };
    })
  })

  describe('getSize', function () {
    it('should return 1 for an empty trie', function () {
      const trie = new Trie()
      expect(trie.getSize()).toBe(1)
    })

    it('should return the correct size', function () {
      const trie = new Trie()
      trie.addString('a')
      expect(trie.getSize()).toBe(2)

      trie.addString('ab')
      expect(trie.getSize()).toBe(3)
    })

    it('should count all branches', function () {
      const trie = new Trie()
      trie.addString('a')
      expect(trie.getSize()).toBe(2)

      trie.addString('ba')
      expect(trie.getSize()).toBe(4)
    })
  })

  describe('searching', function () {
    it("should not find words that haven't been added", function () {
      const trie = new Trie()
      expect(trie.contains('aaaaa')).toBe(false)
    })

    it('should not return prefixes of words that have been added as words', function () {
      const trie = new Trie()
      trie.addString('test')
      expect(trie.contains('test')).toBe(true)
      expect(trie.contains('tes')).toBe(false)
    })

    it('should not return suffixes of words that have been added as words', function () {
      const trie = new Trie()
      trie.addString('test')
      expect(trie.contains('test')).toBe(true)
      expect(trie.contains('est')).toBe(false)
    })

    it('should not find a word that falls in between two other words but has not been added', function () {
      const trie = new Trie()
      trie.addString('test')
      trie.addString('tested')
      expect(trie.contains('test')).toBe(true)
      expect(trie.contains('tested')).toBe(true)
      expect(trie.contains('teste')).toBe(false)
    })
  })

  function expectResults (results) {
    expect(results).toContain('a')
    expect(results).toContain('ab')
    expect(results).toContain('abc')
    expect(results).not.toContain('bc')
    expect(results).not.toContain('cd')
  }

  describe('prefix searching', function () {
    it('should be able to find all full prefix matched words along a path.', function () {
      const trie = new Trie()
      trie.addStrings(['a', 'ab', 'bc', 'cd', 'abc'])
      const results = trie.findMatchesOnPath('abcd')
      expectResults(results)
    })

    it('should be able to guess all full prefix matched words.', function () {
      const trie = new Trie()
      trie.addStrings(['a', 'ab', 'bc', 'cd', 'abc'])
      let results = trie.keysWithPrefix('a')
      expectResults(results)
      results = trie.keysWithPrefix('ab')
      expect(results).toContain('ab')
      expect(results).toContain('abc')
      expect(results).not.toContain('a')
      expect(results).not.toContain('bc')
      expect(results).not.toContain('cd')
    })

    it('should be able to execute the find_prefix search with a match', function () {
      const trie = new Trie()
      trie.addStrings(['their', 'and', 'they'])
      const results = trie.findPrefix('theyre')
      expect(results[0]).toBe('they')
      expect(results[1]).toBe('re')
    })

    it('should return empty array if no full prefix matches found.', function () {
      const trie = new Trie()
      trie.addStrings(['a', 'ab', 'bc', 'cd', 'abc'])
      const results = trie.keysWithPrefix('not-found')
      expect(results.length).toEqual(0)
    })

    it('should be able to execute the find_prefix search without a match', function () {
      const trie = new Trie()
      trie.addStrings(['their', 'and'])
      const results = trie.findPrefix('theyre')
      expect(results[0]).toBe(null)
      expect(results[1]).toBe('yre')
    })
  })

  describe('case sensitivity', function () {
    it('should be case sensitive by default', function () {
      const trie = new Trie()
      trie.addString('test')
      expect(trie.contains('TEST')).toBe(false)
    })

    it('should have contains in case-insensitive mode', function () {
      const trie = new Trie(false)
      trie.addString('test')
      expect(trie.contains('TEST')).toBe(true)
    })

    it('should have case-insensitive contains when the strings are added with case', function () {
      const trie = new Trie(false)
      trie.addString('teSt')
      expect(trie.contains('test')).toBe(true)
    })

    it('should have findMatchesOnPath in case-insensitive mode', function () {
      const trie = new Trie(false)
      trie.addStrings(['a', 'ab', 'bc', 'cd', 'abc'])
      const results = trie.findMatchesOnPath('ABcD')
      expectResults(results)
    })

    it('should have findPrefix in case-insensitive mode', function () {
      const trie = new Trie(false)
      trie.addStrings(['thEIr', 'And', 'theY'])
      const results = trie.findPrefix('ThEyRe')
      expect(results[0]).toBe('they')
      expect(results[1]).toBe('re')
    })
  })
})
