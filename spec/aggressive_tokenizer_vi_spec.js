/*
Copyright (c) 2018, Hugo W.L. ter Doest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this softwé and associated documentation files (the "Softwé"), to deal
in the Softwé without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Softwé, and to permit persons to whom the Softwé is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Softwé.

THE SOFTWé IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWé OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var Tokenizer = require('../lib/natural/tokenizers/aggressive_tokenizer_vi'),
    tokenizer = new Tokenizer();

describe('aggressive_tokenizer_vi', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Tôi bị lạc')).toEqual(['Tôi', 'bị', 'lạc']);
  });

  /*
  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('Bạn giúp tôi đựơc không?'.tokenize()).toEqual(['Bạn', 'giúp', 'tôi', 'đựơc', 'không']);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('Phòng tắm ( nhà thuốc ) ở đâu?'.tokenize()).toEqual(['Phòng', 'tắm', 'nhà', 'thuốc', 'ở', 'đâu']);
  });
  */

  it('should swallow final punctuation', function() {
    expect(tokenizer.tokenize('Làm ơn đợi một lát!'    )).toEqual(['Làm', 'ơn', 'đợi', 'một', 'lát']);
  });

  it('should swallow final punctuation', function() {
    expect(tokenizer.tokenize('Tôi đang tìm John.')).toEqual(['Tôi', 'đang', 'tìm', 'John']);
  });

  it('should swallow initial punctuation', function() {
    expect(tokenizer.tokenize('.Đi thẳng, sau đó rẽ trái / phải')).toEqual(['Đi', 'thẳng', 'sau', 'đó', 'rẽ', 'trái', 'phải']);
  });

  it('should swallow duplicate punctuation', function() {
    expect(tokenizer.tokenize('.Xin giữ máy!')).toEqual(['Xin', 'giữ', 'máy']);
  });
});
