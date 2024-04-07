/*
Copyright (c) 2012, Alexy Maslenninkov

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

const Phonetic = require('./phonetic')

/*
 * Daitch-Mokotoff Soundex Coding
 *
 * The Daitch-Mokotoff Soundex System was created by Randy Daitch and Gary
 * Mokotoff of the Jewish Genealogical Society because they concluded the system
 * developed by Robert Russell in 1918, and in use today by the U.S. National
 * Archives and Records Administration (NARA) does not apply well to many Slavic
 * and Yiddish surnames.  It also includes refinements that are independent of
 * ethnic considerations.
 *
 * The rules for converting surnames into D-M Code numbers are listed below.
 * They are followed by the coding chart.
 *
 * 1. Names are coded to six digits, each digit representing a sound listed in
 * the coding chart (below).
 *
 * 2. When a name lacks enough coded sounds for six digits, use zeros to fill to
 * six digits. GOLDEN which has only four coded sounds [G-L-D-N] is coded as
 * 583600.
 *
 * 3. The letters A, E, I, O, U, J, and Y are always coded at the beginning of a
 * name as in Alpert 087930. In any other situation, they are ignored except
 * when two of them form a pair and the pair comes before a vowel, as in Breuer
 * 791900 but not Freud.
 *
 * 4. The letter H is coded at the beginning of a name, as in Haber 579000, or
 * preceding a vowel, as in Manheim 665600, otherwise it is not coded.
 *
 * 5. When adjacent sounds can combine to form a larger sound, they are given
 * the code number of the larger sound.  Mintz which is not coded MIN-T-Z but
 * MIN-TZ 664000.
 *
 * 6. When adjacent letters have the same code number, they are coded as one
 * sound, as in TOPF, which is not coded TO-P-F 377000 but TO-PF 370000.
 * Exceptions to this rule are the letter combinations MN and NM, whose letters
 * are coded separately, as in Kleinman, which is coded 586660 not 586600.
 *
 * 7. When a surname consists or more than one word, it is coded as if one word,
 * such as Ben Aron which is treated as Benaron.
 *
 * 8. Several letter and letter combinations pose the problem that they may
 * sound in one of two ways.  The letter and letter combinations CH, CK, C, J,
 * and RS are assigned two possible code numbers.
 *
 * For more info, see http://www.jewishgen.org/InfoFiles/soundex.html
 */

/**
 * D-M transformation table in the form of finite-state machine.
 * Every element of the table having member with zero index represents
 * legal FSM state; every non-zero key is the transition rule.
 *
 * Every legal state comprises tree values chosen according to the position
 * of the letter combination in the word:
 *   0: start of a word;
 *   1: before a vowel;
 *   2: any other situation.
 */

/* jscpd:ignore-start */
const codes = {
  A: {
    0: [0, -1, -1],
    I: [[0, 1, -1]],
    J: [[0, 1, -1]],
    Y: [[0, 1, -1]],
    U: [[0, 7, -1]]
  },
  B: [[7, 7, 7]],
  C: {
    0: [5, 5, 5],
    Z: { 0: [4, 4, 4], S: [[4, 4, 4]] },
    S: { 0: [4, 4, 4], Z: [[4, 4, 4]] },
    K: [[5, 5, 5], [45, 45, 45]],
    H: { 0: [5, 5, 5], S: [[5, 54, 54]] }
  },
  D: {
    0: [3, 3, 3],
    T: [[3, 3, 3]],
    Z: { 0: [4, 4, 4], H: [[4, 4, 4]], S: [[4, 4, 4]] },
    S: { 0: [4, 4, 4], H: [[4, 4, 4]], Z: [[4, 4, 4]] },
    R: { S: [[4, 4, 4]], Z: [[4, 4, 4]] }
  },
  E: {
    0: [0, -1, -1],
    I: [[0, 1, -1]],
    J: [[0, 1, -1]],
    Y: [[0, 1, -1]],
    U: [[1, 1, -1]],
    W: [[1, 1, -1]]
  },
  F: {
    0: [7, 7, 7],
    B: [[7, 7, 7]]
  },
  G: [[5, 5, 5]],
  H: [[5, 5, -1]],
  I: {
    0: [0, -1, -1],
    A: [[1, -1, -1]],
    E: [[1, -1, -1]],
    O: [[1, -1, -1]],
    U: [[1, -1, -1]]
  },
  J: [[4, 4, 4]],
  K: {
    0: [5, 5, 5],
    H: [[5, 5, 5]],
    S: [[5, 54, 54]]
  },
  L: [[8, 8, 8]],
  M: {
    0: [6, 6, 6],
    N: [[66, 66, 66]]
  },
  N: {
    0: [6, 6, 6],
    M: [[66, 66, 66]]
  },
  O: {
    0: [0, -1, -1],
    I: [[0, 1, -1]],
    J: [[0, 1, -1]],
    Y: [[0, 1, -1]]
  },
  P: {
    0: [7, 7, 7],
    F: [[7, 7, 7]],
    H: [[7, 7, 7]]
  },
  Q: [[5, 5, 5]],
  R: {
    0: [9, 9, 9],
    Z: [[94, 94, 94], [94, 94, 94]],
    S: [[94, 94, 94], [94, 94, 94]]
  },
  S: {
    0: [4, 4, 4],
    Z: { 0: [4, 4, 4], T: [[2, 43, 43]], C: { Z: [[2, 4, 4]], S: [[2, 4, 4]] }, D: [[2, 43, 43]] },
    D: [[2, 43, 43]],
    T: { 0: [2, 43, 43], R: { Z: [[2, 4, 4]], S: [[2, 4, 4]] }, C: { H: [[2, 4, 4]] }, S: { H: [[2, 4, 4]], C: { H: [[2, 4, 4]] } } },
    C: { 0: [2, 4, 4], H: { 0: [4, 4, 4], T: { 0: [2, 43, 43], S: { C: { H: [[2, 4, 4]] }, H: [[2, 4, 4]] }, C: { H: [[2, 4, 4]] } }, D: [[2, 43, 43]] } },
    H: { 0: [4, 4, 4], T: { 0: [2, 43, 43], C: { H: [[2, 4, 4]] }, S: { H: [[2, 4, 4]] } }, C: { H: [[2, 4, 4]] }, D: [[2, 43, 43]] }
  },
  T: {
    0: [3, 3, 3],
    C: { 0: [4, 4, 4], H: [[4, 4, 4]] },
    Z: { 0: [4, 4, 4], S: [[4, 4, 4]] },
    S: { 0: [4, 4, 4], Z: [[4, 4, 4]], H: [[4, 4, 4]], C: { H: [[4, 4, 4]] } },
    T: { S: { 0: [4, 4, 4], Z: [[4, 4, 4]], C: { H: [[4, 4, 4]] } }, C: { H: [[4, 4, 4]] }, Z: [[4, 4, 4]] },
    H: [[3, 3, 3]],
    R: { Z: [[4, 4, 4]], S: [[4, 4, 4]] }
  },
  U: {
    0: [0, -1, -1],
    E: [[0, -1, -1]],
    I: [[0, 1, -1]],
    J: [[0, 1, -1]],
    Y: [[0, 1, -1]]
  },
  V: [[7, 7, 7]],
  W: [[7, 7, 7]],
  X: [[5, 54, 54]],
  Y: [[1, -1, -1]],
  Z: {
    0: [4, 4, 4],
    D: { 0: [2, 43, 43], Z: { 0: [2, 4, 4], H: [[2, 4, 4]] } },
    H: { 0: [4, 4, 4], D: { 0: [2, 43, 43], Z: { H: [[2, 4, 4]] } } },
    S: { 0: [4, 4, 4], H: [[4, 4, 4]], C: { H: [[4, 4, 4]] } }
  }
}
/* jscpd:ignore-end */

class SoundExDM extends Phonetic {
  process (word, codeLength) {
    codeLength = codeLength || 6
    word = word.toUpperCase()
    let output = ''

    let pos = 0; let lastCode = -1
    while (pos < word.length) {
      const substr = word.slice(pos)
      const rules = this.findRules(substr)

      let code
      if (pos === 0) {
        // at the beginning of the word
        code = rules.mapping[0]
      } else if (substr[rules.length] && this.findRules(substr[rules.length]).mapping[0] === 0) {
        // before a vowel
        code = rules.mapping[1]
      } else {
        // any other situation
        code = rules.mapping[2]
      }

      if ((code !== -1) && (code !== lastCode)) output += code
      lastCode = code
      pos += rules.length
    }

    return this.normalizeLength(output, codeLength)
  }

  findRules (str) {
    let state = codes[str[0]]
    let legalState = state || [[-1, -1, -1]]
    let charsInvolved = 1

    for (let offs = 1; offs < str.length; offs++) {
      if (!state || !state[str[offs]]) break

      state = state[str[offs]]
      if (state[0]) {
        legalState = state
        charsInvolved = offs + 1
      }
    }

    return {
      length: charsInvolved,
      mapping: legalState[0]
    }
  }

  /**
   * Pad right with zeroes or cut excess symbols to fit length
   */
  normalizeLength (token, length) {
    length = length || 6
    if (token.length < length) {
      token += (new Array(length - token.length + 1)).join('0')
    }
    return token.slice(0, length)
  }
}

module.exports = SoundExDM
