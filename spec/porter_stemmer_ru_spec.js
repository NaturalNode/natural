/*
Copyright (c) 2011, Polyakov Vladimir, Chris Umbel

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
var stemmer = require('../lib/natural/stemmers/porter_stemmer_ru');

var test = [
	'в', 'вавиловка', 'вагнера', 'вагон', 'вагона', 'вагоне', 'вагонов', 'вагоном', 'вагоны',
	'важная', 'важнее', 'важнейшие', 'важнейшими', 'важничал', 'важно', 'важного', 'важное',
	'важной', 'важном', 'важному', 'важности', 'важностию', 'важность', 'важностью', 'важную',
	'важны', 'важные', 'важный', 'важным', 'важных', 'вазах', 'вазы', 'вакса', 'вакханка', 'вал',
	'валандался', 'валентина', 'валериановых', 'валерию', 'валетами', 'вали', 'валил', 'валился',
	'валится', 'валов', 'вальдшнепа', 'вальс', 'вальса', 'вальсе', 'вальсишку', 'вальтера', 'валяется',
	'валялась', 'валялись', 'валялось', 'валялся', 'валять', 'валяются', 'вам', 'вами', 'п', 'па', 'пава',
	'павел', 'павильон', 'павильонам', 'павла', 'павлиний', 'павлиньи', 'павлиньим', 'павлович', 'павловна',
	'павловне', 'павловной', 'павловну', 'павловны', 'павловцы', 'павлыч', 'павлыча', 'пагубная', 'падает',
	'падай', 'падал', 'падала', 'падаль', 'падать', 'падаю', 'падают', 'падающего', 'падающие', 'падеж', 'падение',
	'падением', 'падении', 'падений', 'падения', 'паденье', 'паденья', 'падет', 'падут', 'падучая', 'падчерицей',
	'падчерицы', 'падшая', 'падшей', 'падшему', 'падший', 'падшим', 'падших', 'падшую', 'паек', 'пазухи', 'пазуху',
	'пай', 'пакет', 'пакетом', 'пакеты', 'пакостей', 'пакостно', 'пал'];

var testResult = [
	'в', 'вавиловк', 'вагнер', 'вагон', 'вагон', 'вагон', 'вагон', 'вагон', 'вагон', 'важн', 'важн', 'важн',
	'важн', 'важнича', 'важн', 'важн', 'важн', 'важн', 'важн', 'важн', 'важност', 'важност', 'важност',
	'важност', 'важн', 'важн', 'важн', 'важн', 'важн', 'важн', 'ваз', 'ваз', 'вакс', 'вакханк', 'вал',
	'валанда', 'валентин', 'валерианов', 'валер', 'валет', 'вал', 'вал', 'вал', 'вал', 'вал', 'вальдшнеп',
	'вальс', 'вальс', 'вальс', 'вальсишк', 'вальтер', 'валя', 'валя', 'валя', 'валя', 'валя', 'валя', 'валя',
	'вам', 'вам', 'п', 'па', 'пав', 'павел', 'павильон', 'павильон', 'павл', 'павлин', 'павлин', 'павлин',
	'павлович', 'павловн', 'павловн', 'павловн', 'павловн', 'павловн', 'павловц', 'павлыч', 'павлыч', 'пагубн',
	'пада', 'пада', 'пада', 'пада', 'падал', 'пада', 'пада', 'пада', 'пада', 'пада', 'падеж', 'паден', 'паден',
	'паден', 'паден', 'паден', 'паден', 'паден', 'падет', 'падут', 'падуч', 'падчериц', 'падчериц', 'падш', 'падш',
	'падш', 'падш', 'падш', 'падш', 'падш', 'паек', 'пазух', 'пазух', 'па', 'пакет', 'пакет', 'пакет', 'пакост',
	'пакостн', 'пал'];

describe('porter_stemmer', function() {
	it('should permof stem', function() {
		for (var i = 0; i < test.length; i++) {
			expect(stemmer.stem(test[i])).toBe(testResult[i]);
		}
	}),
	it('should tokenize and stem attached', function() {
		stemmer.attach();
		expect('мама мыла раму'.tokenizeAndStem()).toEqual(['мам', 'мыл', 'рам']);
		expect('МАМА МЫЛА РАМУ'.tokenizeAndStem()).toEqual(['мам', 'мыл', 'рам']);
	});
});
