/*
Copyright (c) 2011, Chris Umbel

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

var Phonetic = require('./phonetic');

var DoubleMetaphone = new Phonetic();
module.exports = DoubleMetaphone;

function isVowel(c) {
	return c.match(/[aeiouy]/i);
}

function process(token, spyCallback) {
	token = token.toUpperCase();
	var primary = '', secondary = '';	
    var pos = 0;
    var spy = {};

    function current(length) {
    	return token.substring(pos, pos + length);
    }

    function add(primaryAppendage, secondaryAppendage) {
    	primary += primaryAppendage;

    	if(secondaryAppendage)
    		secondary += secondaryAppendage;
    	else
    		secondary += primaryAppendage;
    }

    if(['GN', 'KN', 'PN', 'WR', 'PS'].indexOf(current(2)) > -1) {
    	pos++;
    	spy.initialSilentConsonantSkipped = true;
    }

    while(pos < token.length) {
    	switch(token[pos]) {
	        case 'A': case 'E': case 'I': case 'O': case 'U': case 'Y': 
	        case 'Ê': case 'É': case 'É': case'À':
		        if(pos == 0)
		        	add('A');
		        break;
	        case 'Ç':
	            add("S");
	            break;
	        case 'F':
	        	// nix doubles
	        	if(token[pos + 1] == 'F')
	        		pos++;
	        	add('F');
	        	break;
	        case 'H':
	        	// keep if starts a word or is surrounded by vowels
	        	if((pos == 0 || isVowel(token[pos - 1])) && isVowel(token[pos + 1])) {
	        		add('H');
	        		pos++;
	        	}
	        	break;
	        case 'N':
	        	// nix doubles
	        	if(token[pos + 1] == 'N')
	        		pos++;
	        	add('N');
	        	break;
    	}

    	pos++;
    }

    if(spyCallback)
    	spyCallback(spy);

    return [primary, secondary];
}

DoubleMetaphone.process = process;
DoubleMetaphone.isVowel = isVowel;
