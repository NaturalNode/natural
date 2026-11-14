'use strict'

import { RegexpTokenizer, TfIdf, WordTokenizer } from 'lib/natural'

describe('RegexpTokenizer in match mode', function () {
  for (const pattern of [/\d+/g, /\d+/]) {
    for (const text of ['', 'no numbers']) {
      it('returns an empty array for ' + JSON.stringify(text) + ' with ' + pattern.toString(), function () {
        const tokenizer = new RegexpTokenizer({ pattern, gaps: false })

        expect(tokenizer.tokenize(text)).toEqual([])
      })
    }
  }

  it('returns all matches for a global pattern', function () {
    const tokenizer = new RegexpTokenizer({ pattern: /\d+/g, gaps: false })

    expect(tokenizer.tokenize('items 12 and 34')).toEqual(['12', '34'])
  })

  it('preserves capture groups for a non-global pattern', function () {
    const tokenizer = new RegexpTokenizer({ pattern: /(\d+)/, gaps: false })

    expect(Array.from(tokenizer.tokenize('item 12'))).toEqual(['12', '12'])
  })

  it('preserves empty string matches', function () {
    const tokenizer = new RegexpTokenizer({ pattern: /^/g, gaps: false })

    expect(tokenizer.tokenize('')).toEqual([''])
  })

  it('can tokenize documents and queries without matches for TfIdf', function () {
    const tfidf = new TfIdf()
    tfidf.setTokenizer(new RegexpTokenizer({ pattern: /\d+/g, gaps: false }))

    try {
      tfidf.addDocument('no numbers')
      tfidf.addDocument('item 42')

      expect(tfidf.listTerms(0)).toEqual([])
      expect(tfidf.tfidf('no numbers', 1)).toBe(0)
      expect(tfidf.tfidf('42', 1)).toBeGreaterThan(0)
    } finally {
      tfidf.setTokenizer(new WordTokenizer())
    }
  })
})
