/*
Copyright (c) 2011, Rob Ellis, Chris Umbel

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

const _ = require('underscore')

/*
 Sentences Analyzer Class
 From http://www.writingcentre.uottawa.ca/hypergrammar/sntpurps.html

 Take a POS input and analyse it for
  - Type of Sentense
     - Interrogative
       - Tag Questions
       -
     - Declarative
     - Exclamatory
     - Imperative

  - Parts of a Sentense
     - Subject
     - Predicate

  - Show Preposition Phrases
*/

class SentenceAnalyzer {
  constructor (pos, callbackFunction) {
    this.posObj = pos
    this.senType = null
    callbackFunction(this)
  }

  part (callbackFunction) {
    const subject = []
    const predicat = []
    let verbFound = false

    this.prepositionPhrases()

    for (let i = 0; i < this.posObj.tags.length; i++) {
      if (this.posObj.tags[i].pos === 'VB') {
        if (i === 0) {
          verbFound = true
        } else {
          // We need to Test for any EX before the VB
          if (this.posObj.tags[i - 1].pos !== 'EX') {
            verbFound = true
          } else {
            predicat.push(this.posObj.tags[i].token)
          }
        }
      }

      // Add Pronoun Phrase (pp) Or Subject Phrase (sp)
      if (!verbFound) {
        if (this.posObj.tags[i].pp !== true) { this.posObj.tags[i].spos = 'SP' }

        subject.push(this.posObj.tags[i].token)
      } else {
        if (this.posObj.tags[i].pp !== true) { this.posObj.tags[i].spos = 'PP' }

        predicat.push(this.posObj.tags[i].token)
      }
    }

    if (subject.length === 0) {
      this.posObj.tags.push({ token: 'You', spos: 'SP', pos: 'PRP', added: true })
    }

    callbackFunction(this)
  }

  // Takes POS and removes IN to NN or NNS
  // Adds a PP for each prepositionPhrases
  prepositionPhrases () {
    let remove = false

    for (let i = 0; i < this.posObj.tags.length; i++) {
      if (this.posObj.tags[i].pos.match('IN')) {
        remove = true
      }

      if (remove) {
        this.posObj.tags[i].pp = true
      }

      if (this.posObj.tags[i].pos.match('NN')) {
        remove = false
      }
    }
  }

  subjectToString () {
    return this.posObj.tags.map(function (t) {
      if (t.spos === 'SP' || t.spos === 'S') {
        return t.token
      } else return null
    }).join(' ')
  }

  predicateToString () {
    return this.posObj.tags.map(function (t) {
      if (t.spos === 'PP' || t.spos === 'P') {
        return t.token
      } else return null
    }).join(' ')
  }

  implicitYou () {
    for (let i = 0; i < this.posObj.tags.length; i++) {
      if (this.posObj.tags[i].added) {
        return true
      }
    }

    return false
  }

  toString () {
    return this.posObj.tags.map(function (t) { return t.token }).join(' ')
  }

  // This is quick and incomplete.
  type (cbf) {
    const callbackFunction = cbf || false

    // Check for implicit you before popping a tag.
    const implicitYou = this.implicitYou()

    // FIXME - punct seems useless
    let lastElement = this.posObj.punct()
    // console.log(lastElement)
    lastElement = (lastElement.length !== 0) ? lastElement.pop() : this.posObj.tags.pop()
    // console.log(lastElement)

    if (lastElement.pos !== '.') {
      if (implicitYou) {
        this.senType = 'COMMAND'
      } else if (_.contains(['WDT', 'WP', 'WP$', 'WRB'], this.posObj.tags[0].pos)) {
        // Sentences that start with: who, what where when why and how, then they are questions
        this.senType = 'INTERROGATIVE'
      } else if (_.contains(['PRP'], lastElement.pos)) {
        // Sentences that end in a Personal pronoun are most likely questions
        // eg. We should run away, should we [?]
        // eg. You want to see that again, do you [?]
        this.senType = 'INTERROGATIVE'
      } else {
        this.senType = 'UNKNOWN'
      }
    } else {
      switch (lastElement.token) {
        case '?':
          this.senType = 'INTERROGATIVE'
          break
        case '!':
          this.senType = (implicitYou) ? 'COMMAND' : 'EXCLAMATORY'
          break
        case '.':
          this.senType = (implicitYou) ? 'COMMAND' : 'DECLARATIVE'
          break
      }
    }

    if (callbackFunction && _.isFunction(callbackFunction)) {
      callbackFunction(this)
    } else {
      return this.senType
    }
  }
}

module.exports = SentenceAnalyzer
