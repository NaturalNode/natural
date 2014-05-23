/*
Copyright (c) 2014, Kristoffer Brabrand

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

var stemmer = require('../lib/natural/stemmers/porter_stemmer_no'),
    fs = require('fs');

describe('porter_stemmer_no', function() {
    it('should perform step 1a', function() {
        expect(stemmer.step1a('forenkla')).toBe('forenkl');
        expect(stemmer.step1a('aase')).toBe('aas');
        expect(stemmer.step1a('allerede')).toBe('aller');
        expect(stemmer.step1a('aukande')).toBe('auk');
        expect(stemmer.step1a('avbøtende')).toBe('avbøt');
        expect(stemmer.step1a('avdelingane')).toBe('avdeling');
        expect(stemmer.step1a('avgiftene')).toBe('avgift');
        expect(stemmer.step1a('havnevirksomhetene')).toBe('havnevirksom');
        expect(stemmer.step1a('heimelen')).toBe('heimel');
        expect(stemmer.step1a('hovedvirksomheten')).toBe('hovedvirksom');
        expect(stemmer.step1a('hovudreglar')).toBe('hovudregl');
        expect(stemmer.step1a('hugger')).toBe('hugg');
        expect(stemmer.step1a('importvirksomheter')).toBe('importvirksom');
        expect(stemmer.step1a('ivaretas')).toBe('ivaret');
        expect(stemmer.step1a('iverksettes')).toBe('iverksett');
        expect(stemmer.step1a('konsekvensutredes')).toBe('konsekvensutr');
        expect(stemmer.step1a('oversendes')).toBe('overs');
        expect(stemmer.step1a('pensjonenes')).toBe('pensjon');
        expect(stemmer.step1a('myndighetenes')).toBe('myndig');
        expect(stemmer.step1a('møteleiarens')).toBe('møteleiar');
        expect(stemmer.step1a('virksomhetens')).toBe('virksom');
        expect(stemmer.step1a('aktørers')).toBe('aktør');
        expect(stemmer.step1a('arbeidslivets')).toBe('arbeidsliv');
        expect(stemmer.step1a('arbeidskapasitet')).toBe('arbeidskapasit');
        expect(stemmer.step1a('arealknapphet')).toBe('arealknapp');
        expect(stemmer.step1a('attgjevast')).toBe('attgjev');
    });

    it('should perform step 1b', function() {
        expect(stemmer.step1b('hinder')).toBe('hinder');
        expect(stemmer.step1b('erwerbs')).toBe('erwerb');
        expect(stemmer.step1b('alltids')).toBe('alltid');
    });

    it('should perform step 1c', function() {
        expect(stemmer.step1c('akkumulerte')).toBe('akkumuler');
        expect(stemmer.step1c('akseptert')).toBe('aksepter');
    });

    it('should perform step 1 (a-c)', function() {
        expect(stemmer.step1('andelar')).toBe('andel');
        expect(stemmer.step1('andeleigar')).toBe('andeleig');
        expect(stemmer.step1('andeleigarane')).toBe('andeleigar');
        expect(stemmer.step1('andeleigarbok')).toBe('andeleigarbok');
        expect(stemmer.step1('andelen')).toBe('andel');
        expect(stemmer.step1('andelene')).toBe('andel');
        expect(stemmer.step1('andeler')).toBe('andel');
        expect(stemmer.step1('andelsbevis')).toBe('andelsbevis');
        expect(stemmer.step1('andelsbok')).toBe('andelsbok');
        expect(stemmer.step1('andelsboka')).toBe('andelsbok');
        expect(stemmer.step1('andelsboligforening')).toBe('andelsboligforening');
        expect(stemmer.step1('andelsboligforeninger')).toBe('andelsboligforening');
        expect(stemmer.step1('andelsboligorganisation')).toBe('andelsboligorganisation');
        expect(stemmer.step1('andelsboligorganisationer')).toBe('andelsboligorganisation');
        expect(stemmer.step1('andelsbrev')).toBe('andelsbrev');
    });

    it('should perform step 2', function() {
        expect(stemmer.step2('hvorvidt')).toBe('hvorvid');
        expect(stemmer.step2('innovativt')).toBe('innovativ');
    });

    it('should perform step 3', function() {
        expect(stemmer.step3('lovleg')).toBe('lov');
        expect(stemmer.step3('konkurranseskadeleg')).toBe('konkurranseskad');
        expect(stemmer.step3('lystig')).toBe('lyst');
        expect(stemmer.step3('utrolig')).toBe('utro');
        expect(stemmer.step3('utrøstelig')).toBe('utrøst');
        expect(stemmer.step3('boliglov')).toBe('bolig');
        expect(stemmer.step3('samvirkelov')).toBe('samvirk');
        expect(stemmer.step3('arveavgiftslov')).toBe('arveavgift');
    });

    it('should perform stemming on a lot of words', function() {
        var ok = [];
        var ko = [];

        fs.readFileSync('spec/test_data/snowball_no.txt').toString().split('\n').forEach(function(line) {
            if (line) {
                var fields = line.replace(/(\s)+/g, ' ').split(' ');
                var stemmed = stemmer.stem(fields[0]);

                if (stemmed === fields[1]) {
                    ok.push(fields[0]);
                } else {
                    ko.push({
                        word: fields[0],
                        expected: fields[1],
                        actual: stemmed
                    });
                }
            }
        });

        expect(ko.length).toBe(0);
    });

    it('should perform complete stemming', function() {
        expect(stemmer.step1a('forenkla')).toBe('forenkl');
        expect(stemmer.step1a('aase')).toBe('aas');
        expect(stemmer.step1a('allerede')).toBe('aller');
        expect(stemmer.step1a('aukande')).toBe('auk');
        expect(stemmer.step1a('avbøtende')).toBe('avbøt');
        expect(stemmer.step1b('hinder')).toBe('hinder');
        expect(stemmer.step1b('erwerbs')).toBe('erwerb');
        expect(stemmer.step3('boliglov')).toBe('bolig');
        expect(stemmer.step3('samvirkelov')).toBe('samvirk');
        expect(stemmer.step3('arveavgiftslov')).toBe('arveavgift');
    });

    it('should tokenize and stem attached', function() {
        stemmer.attach();
        expect('forebygger vedlikeholdsbehovene'.tokenizeAndStem()).toEqual(['forebygg', 'vedlikeholdsbehov']);
        expect('FOREBYGGER VEDLIKEHOLDSBEHOVENE'.tokenizeAndStem()).toEqual(['forebygg', 'vedlikeholdsbehov']);
    });
});
