/*
Copyright (c) 2017, Dogan Yazar

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

var Stemmer = require('./stemmer_sv')

//Get R1 region
function getRegions(str) {
  const match = str.match(/[aeiouyäåö][^aeiouyäåö]([a-zåäö]+)/)
  let r1 = ''
  if (match && match[1]) {
    r1 = match[1]
    if (match.index + 2 < 3) { //Not clear why we need this! Algorithm does not describe this part!
      r1 = str.slice(3)
    }
  }
  return {
    r1,
    rest: str.slice(0, str.length - r1.length)
  }
}

function step1a(str, regions = getRegions(str)) {
  const r1 = regions.r1
  if (!r1) {
    return str
  }

  const regEx = /(heterna|hetens|anden|andes|andet|arens|arnas|ernas|heten|heter|ornas|ande|ades|aren|arna|arne|aste|erna|erns|orna|ade|are|ast|ens|ern|het|ad|ar|as|at|en|er|es|or|a|e)$/
  const match = r1.match(regEx)
  return match ? regions.rest + r1.slice(0, match.index) : str
}

function step1b(str, regions = getRegions(str)) {
  if (regions.r1 && str.match(/(b|c|d|f|g|h|j|k|l|m|n|o|p|r|t|v|y)s$/)) {
    return str.slice(0, -1)
  }

  return str
}

function step1(str) {
  const regions = getRegions(str)
  const resA = step1a(str, regions)
  const resB = step1b(str, regions)

  return resA.length < resB.length ? resA : resB
}

function step2(str, regions = getRegions(str)) {
  const r1 = regions.r1
  if (r1 && r1.match(/(dd|gd|nn|dt|gt|kt|tt)$/)) {
    return str.slice(0, -1)
  }
  return str
}

function step3(str, regions = getRegions(str)) {
  const r1 = regions.r1
  if (r1) {
    if (r1.match(/(lös|full)t$/)) {
      return str.slice(0, -1)
    }

    const match = r1.match(/(lig|ig|els)$/)
    return match ? regions.rest + r1.slice(0, match.index) : str
  }

  return str
}

function stem(_str) {
  const str = _str.toLowerCase()
  return step3(step2(step1(str)))
}

var PorterStemmer = new Stemmer()
module.exports = PorterStemmer

// perform full stemming algorithm on a single word
PorterStemmer.stem = stem
