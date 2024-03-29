/*
  Sentence class that generates sample elements from sentences
  Copyright (C) 2018 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

class Sentence {
  constructor (data) {
    this.taggedWords = []
    if (data) {
      this.taggedWords = data
    }
  }

  addTaggedWord (token, tag) {
    this.taggedWords.push({
      token: token,
      tag: tag
    })
  }

  clone () {
    const s = new Sentence()
    this.taggedWords.forEach(function (wordObject) {
      s.addTaggedWord(wordObject.token, wordObject.tag)
    })
    return s
  }
}
module.exports = Sentence
