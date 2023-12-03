/*
Sample space of observed events
Copyright (C) 2018 Hugo W.L. ter Doest

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

const Context = require('./Context')

const fs = require('fs')

class Sample {
  constructor (elements) {
    this.frequencyOfContext = {}
    this.frequency = {}
    this.classes = []
    if (elements) {
      this.elements = elements
      this.analyse()
    } else {
      this.elements = []
    }
  }

  // Extracts classes and frequencies
  analyse () {
    const that = this
    this.elements.forEach(function (x) {
      if (this.classes.indexOf(x.a) === -1) {
        this.classes.push(x.a)
      }
      if (!that.frequencyOfContext[x.b.toString()]) {
        that.frequencyOfContext[x.b.toString()] = 0
      }
      that.frequencyOfContext[x.b.toString()]++
      if (!that.frequency[x.toString()]) {
        that.frequency[x.toString()] = 0
      }
      that.frequency[x.toString()]++
    })
  }

  addElement (x) {
    this.elements.push(x)
    // Update frequencies
    if (!this.frequencyOfContext[x.b.toString()]) {
      this.frequencyOfContext[x.b.toString()] = 0
    }
    this.frequencyOfContext[x.b.toString()]++
    if (!this.frequency[x.toString()]) {
      this.frequency[x.toString()] = 0
    }
    this.frequency[x.toString()]++
    // Update classes
    if (this.classes.indexOf(x.a) === -1) {
      this.classes.push(x.a)
    }
  }

  observedProbabilityOfContext (context) {
    if (this.frequencyOfContext[context.toString()]) {
      return this.frequencyOfContext[context.toString()] / this.elements.length
    } else {
      return 0
    }
  }

  observedProbability (x) {
    if (this.frequency[x.toString()]) {
      return this.frequency[x.toString()] / this.elements.length
    } else {
      return 0
    }
  }

  size () {
    return this.elements.length
  }

  getClasses () {
    return this.classes
  }

  generateFeatures (featureSet) {
    this.elements.forEach(function (x) {
      x.generateFeatures(featureSet)
    })
  }

  save (filename, callback) {
    const sample = this
    const data = JSON.stringify(this, null, 2)
    fs.writeFile(filename, data, 'utf8', function (err) {
      // console.log('Sample written')
      if (callback) {
        callback(err, err ? null : sample)
      }
    })
  }

  // Loads a sample from file and revives the right classes, i.e. Sample and
  // Element classes.
  load (filename, ElementClass, callback) {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (!err) {
        const sampleData = JSON.parse(data)
        const sample = new Sample()
        sampleData.elements.forEach(function (elementData) {
          const elt = new ElementClass(elementData.a, new Context(elementData.b.data))
          sample.addElement(elt)
        })
        if (!sample.frequency || !sample.frequencyOfContext) {
          sample.analyse()
        }
        if (callback) {
          callback(err, sample)
        }
      } else {
        if (callback) {
          callback(err)
        }
      }
    })
  }
}

module.exports = Sample
