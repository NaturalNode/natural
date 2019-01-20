/*
Copyright (c) 2019, Hugo W.L. ter Doest

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

var fs = require('fs');

var Sample = require('lib/natural/classifiers/maxent/Sample');
var Element = require('lib/natural/classifiers/maxent/Element');
var Context = require('lib/natural/classifiers/maxent/Context');

const DEBUG = false;
const sampleFile = 'io_spec/test_data/sample.json';


describe("Sample class", function() {

  // Create sample
  var sample = new Sample();
  sample.addElement(new Element("x", new Context("0")));
  sample.addElement(new Element("y", new Context("0")));
  sample.addElement(new Element("x", new Context("1")));
  sample.addElement(new Element("y", new Context("1")));

  it("saves a sample to a file", function(done) {
    sample.save(sampleFile, function(err, sample) {
      if (err) {
        console.log(err);
        expect(false).toBe(true);
      }
      else {
        DEBUG && console.log("Sample saved to "  + sampleFile);
        expect(fs.existsSync(sampleFile)).toBe(true);
      }
      done();
    });
  });

  var newSample = null;
  it("loads a sample from a file", function(done) {
    sample.load(sampleFile, Element, function(err, s) {
      if (err) {
        console.log(err);
        expect(false).toBe(true);
      }
      else {
        DEBUG && console.log("Sample loaded from "  + sampleFile);
        expect(s.size()).toEqual(sample.size());
        newSample = s;
      }
      done();
    });
    if (newSample) {
      expect(newSample.size()).toEqual(sample.size());
      sample = newSample;
    }
  });

});
