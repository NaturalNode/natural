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
function Trie (caseSensitive) {
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
Trie.prototype.addString = function (string) {
  if (this.cs === false) {
    string = string.toLowerCase()
  }

  // If the string has only one letter, mark this as a word.
  if (string.length === 0) {
    const wasWord = this.$
    this.$ = true
    return wasWord
  }

  // Make sure theres a Trie node in our dictionary
  let next = this.dictionary[string[0]]

  if (!next) {
    this.dictionary[string[0]] = new Trie(this.cs)
    next = this.dictionary[string[0]]
  }

  // Continue adding the string
  return next.addString(string.substring(1))
}

/**
 * Add multiple strings to the TRIE
 **/
Trie.prototype.addStrings = function (list) {
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
Trie.prototype.keysWithPrefix = function (prefix) {
  if (this.caseSensitive === false) {
    prefix = prefix.toLowerCase()
  }

  function isEmpty (object) {
    for (const key in object) if (object[key]) return false
    return true
  }

  function get (node, word) {
    if (!node) return null
    if (word.length === 0) return node
    return get(node.dictionary[word[0]], word.substring(1))
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
Trie.prototype.contains = function (string) {
  if (this.cs === false) {
    string = string.toLowerCase()
  }

  if (string.length === 0) {
    return this.$
  }

  // Otherwise, we need to continue searching
  const firstLetter = string[0]
  const next = this.dictionary[firstLetter]

  // If we don't have a node, this isn't a word
  if (!next) {
    return false
  }

  // Otherwise continue the search at the next node
  return next.contains(string.substring(1))
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
Trie.prototype.findMatchesOnPath = function (search) {
  if (this.cs === false) {
    search = search.toLowerCase()
  }

  function recurse (node, search, stringAgg, resultsAgg) {
    // Check if this is a word.
    if (node.$) {
      resultsAgg.push(stringAgg)
    }

    // Check if the have completed the seearch
    if (search.length === 0) {
      return resultsAgg
    }

    // Otherwise, continue searching
    const next = node.dictionary[search[0]]
    if (!next) {
      return resultsAgg
    }
    return recurse(next, search.substring(1), stringAgg + search[0], resultsAgg)
  };

  return recurse(this, search, '', [])
}

/**
 * Returns the longest match and the remaining part that could not be matched.
 * inspired by [NLTK containers.trie.find_prefix](http://nltk.googlecode.com/svn-/trunk/doc/api/nltk.containers.Trie-class.html).
 **/
Trie.prototype.findPrefix = function (search) {
  if (this.cs === false) {
    search = search.toLowerCase()
  }

  function recurse (node, search, stringAgg, lastWord) {
    // Check if this is a word
    if (node.$) {
      lastWord = stringAgg
    }

    // Check if we have no more to search
    if (search.length === 0) {
      return [lastWord, search]
    }

    // Continue searching
    const next = node.dictionary[search[0]]
    if (!next) {
      return [lastWord, search]
    }
    return recurse(next, search.substring(1), stringAgg + search[0], lastWord)
  };

  return recurse(this, search, '', null)
}

/**
 * Computes the number of actual nodes from this node to the end.
 * Note: This involves traversing the entire structure and may not be
 * good for frequent use.
 **/
Trie.prototype.getSize = function () {
  let total = 1
  for (const c in this.dictionary) {
    total += this.dictionary[c].getSize()
  }
  return total
}

/**
 * EXPORT THE TRIE
 **/
module.exports = Trie
