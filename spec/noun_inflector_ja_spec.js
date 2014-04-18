/*
 Copyright (c) 2012, Guillaume Marty

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

var NounInflector = require('../lib/natural/inflectors/ja/noun_inflector'),
    inflector = new NounInflector();

describe('NounInflector', function() {
  describe('.pluralize()', function() {
    describe('should pluralize nouns', function() {
      expect(inflector.pluralize('ひと')).toBe('ひとたち');
      expect(inflector.pluralize('わたし')).toBe('わたしたち');
      expect(inflector.pluralize('私')).toBe('私たち');
    });

    describe('should not pluralize exceptions', function() {
      expect(inflector.pluralize('ともだち')).toBe('ともだち');
      expect(inflector.pluralize('友だち')).toBe('友だち');
      expect(inflector.pluralize('友達')).toBe('友達');
    });

    describe('should pluralize archaic forms', function() {
      expect(inflector.pluralize('神')).toBe('神神');
      expect(inflector.pluralize('人')).toBe('人人');
      expect(inflector.pluralize('我')).toBe('我我');
    });
  });

  describe('.singularize()', function() {
    describe('should singularize regular nouns ending by -tachi in Hiragana', function() {
      expect(inflector.singularize('わたしたち')).toBe('わたし');
      expect(inflector.singularize('人たち')).toBe('人');
      expect(inflector.singularize('りかたち')).toBe('りか');
    });

    describe('should not singularize exception nouns ending by -tachi in Hiragana', function() {
      expect(inflector.singularize('ついたち')).toBe('ついたち');
      expect(inflector.singularize('かたち')).toBe('かたち');
      expect(inflector.singularize('はたち')).toBe('はたち');
    });

    describe('should singularize regular nouns ending by -tachi in Kanji', function() {
      expect(inflector.singularize('わたし達')).toBe('わたし');
      expect(inflector.singularize('人達')).toBe('人');
      expect(inflector.singularize('日伊達')).toBe('日伊');
    });

    describe('should not singularize exception nouns ending by -tachi in Kanji', function() {
      expect(inflector.singularize('上達')).toBe('上達');
      expect(inflector.singularize('配達')).toBe('配達');
      expect(inflector.singularize('発達')).toBe('発達');
    });

    describe('should singularize regular nouns ending by -ra in Kanji', function() {
      expect(inflector.singularize('僕等')).toBe('僕');
      expect(inflector.singularize('貴様等')).toBe('貴様');
      expect(inflector.singularize('圭一等')).toBe('圭一');
    });

    describe('should not singularize exception nouns ending by -ra in Kanji', function() {
      expect(inflector.singularize('下等')).toBe('下等');
      expect(inflector.singularize('初等')).toBe('初等');
      expect(inflector.singularize('一等')).toBe('一等');
    });

    describe('should singularize regular nouns ending by -gata', function() {
      expect(inflector.singularize('神様方')).toBe('神様');
      expect(inflector.singularize('先生方')).toBe('先生');
      expect(inflector.singularize('あなたがた')).toBe('あなた');
    });

    describe('should singularize regular nouns ending by -domo', function() {
      expect(inflector.singularize('人間共')).toBe('人間');
      expect(inflector.singularize('野郎共')).toBe('野郎');
      expect(inflector.singularize('ガキども')).toBe('ガキ');
    });

    describe('should pluralize archaic forms', function() {
      expect(inflector.singularize('神神')).toBe('神');
      expect(inflector.singularize('人人')).toBe('人');
      expect(inflector.singularize('我我')).toBe('我');
    });
  });

  describe('.attach()', function() {
    describe('should attach new methods to String', function() {
      inflector.attach();
      expect('私'.pluralizeNoun()).toBe('私たち');
      expect('私たち'.singularizeNoun()).toBe('私');
      expect('人'.pluralizeNoun()).toBe('人人');
      expect('人人'.singularizeNoun()).toBe('人');
    });
  });
});
