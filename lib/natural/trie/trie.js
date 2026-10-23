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

/**
 * The basis of the TRIE structure.
 **/
class Trie {
  constructor (caseSensitive) {
    this.dictionary = Object.create(null) // {}
    this.$ = false

    if (typeof caseSensitive === 'undefined') {
      caseSensitive = true
    }

    this.cs = caseSensitive
  }

  /**
   * Add a single string to the TRIE, returns true if the word was already in the
   * trie.
   **/
  addString (string) {
    if (this.cs === false) {
      string = string.toLowerCase()
    }

    const caseSensitive = this.cs
    let node = this

    for (let index = 0, length = string.length; index < length; index++) {
      const character = string[index]
      let next = node.dictionary[character]
      if (!next) {
        node.dictionary[character] = next = new Trie(caseSensitive)
      }
      node = next
    }

    const wasWord = node.$
    node.$ = true
    return wasWord
  }

  /**
   * Add multiple strings to the TRIE
   **/
  addStrings (list) {
    for (const i in list) {
      this.addString(list[i])
    }
  }

  /**
   * A function to search the TRIE and return an array of
   * words which have same prefix <prefix>
   * for example if we had the following words in our database:
   * a, ab, bc, cd, abc, abd
   * and we search the string: a
   * we will get :
   * [a, ab, abc, abd]
   **/
  keysWithPrefix (prefix) {
    if (this.caseSensitive === false) {
      prefix = prefix.toLowerCase()
    }

    function isEmpty (object) {
      for (const key in object) if (object[key]) return false
      return true
    }

    function get (node, word) {
      for (let index = 0, length = word.length; index < length; index++) {
        if (!node) return null
        node = node.dictionary[word[index]]
      }
      return node || null
    }

    function recurse (node, stringAgg, resultsAgg) {
      if (!node) return

      // Check if this is a word
      if (node.$) {
        resultsAgg.push(stringAgg)
      }

      if (isEmpty(node.dictionary)) {
        return
      }

      for (const c in node.dictionary) {
        recurse(node.dictionary[c], stringAgg + c, resultsAgg)
      }
    }

    const results = []
    recurse(get(this, prefix), prefix, results)
    return results
  }

  /**
   * A function to search the given string and return true if it lands
   * on on a word. Essentially testing if the word exists in the database.
   **/
  contains (string) {
    if (this.cs === false) {
      string = string.toLowerCase()
    }

    let node = this
    for (let index = 0, length = string.length; index < length; index++) {
      node = node.dictionary[string[index]]
      if (!node) {
        return false
      }
    }

    return node.$
  }

  /**
   * A function to search the TRIE and return an array of words which were encountered along the way.
   * This will only return words with full prefix matches.
   * for example if we had the following words in our database:
   * a, ab, bc, cd, abc
   * and we searched the string: abcd
   * we would get only:
   * [a, ab, abc]
   **/
  findMatchesOnPath (search) {
    if (this.cs === false) {
      search = search.toLowerCase()
    }

    const results = []
    let node = this
    const length = search.length

    for (let index = 0; ; index++) {
      // Check if this is a word.
      if (node.$) {
        results.push(search.slice(0, index))
      }

      // Check if the have completed the seearch
      if (index === length) {
        return results
      }

      // Otherwise, continue searching
      node = node.dictionary[search[index]]
      if (!node) {
        return results
      }
    }
  }

  /**
   * Returns the longest match and the remaining part that could not be matched.
   * inspired by [NLTK containers.trie.find_prefix](http://nltk.googlecode.com/svn-/trunk/doc/api/nltk.containers.Trie-class.html).
   **/
  findPrefix (search) {
    if (this.cs === false) {
      search = search.toLowerCase()
    }

    let node = this
    let lastWordIndex = null
    const length = search.length

    for (let index = 0; ; index++) {
      // Check if this is a word
      if (node.$) {
        lastWordIndex = index
      }

      // Check if we have no more to search
      if (index === length) {
        return [
          lastWordIndex === null ? null : search.slice(0, lastWordIndex),
          ''
        ]
      }

      // Continue searching
      node = node.dictionary[search[index]]
      if (!node) {
        return [
          lastWordIndex === null ? null : search.slice(0, lastWordIndex),
          search.slice(index)
        ]
      }
    }
  }

  /**
   * Computes the number of actual nodes from this node to the end.
   * Note: This involves traversing the entire structure and may not be
   * good for frequent use.
   **/
  getSize () {
    let total = 1
    for (const c in this.dictionary) {
      total += this.dictionary[c].getSize()
    }
    return total
  }
}

/**
 * EXPORT THE TRIE
 **/
module.exports = Trie
