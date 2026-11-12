'use strict'

import { RegexpTokenizer } from 'lib/natural'

describe('RegexpTokenizer', function () {
  describe('discardEmpty', function () {
    it('should discard empty tokens by default', function () {
      const tokenizer = new RegexpTokenizer({ pattern: /,/ })
      expect(tokenizer.tokenize('a,,b,')).toEqual(['a', 'b'])
    })

    it('should discard empty tokens when discardEmpty is true', function () {
      const tokenizer = new RegexpTokenizer({ pattern: /,/, discardEmpty: true })
      expect(tokenizer.tokenize('a,,b,')).toEqual(['a', 'b'])
    })

    it('should keep empty tokens when discardEmpty is false', function () {
      const tokenizer = new RegexpTokenizer({ pattern: /,/, discardEmpty: false })
      expect(tokenizer.tokenize('a,,b,')).toEqual(['a', '', 'b', ''])
    })
  })
})
