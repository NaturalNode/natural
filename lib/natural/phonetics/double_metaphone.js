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

    function addSecondary(primaryAppendage, secondaryAppendage) {
    	primary += primaryAppendage;
    	secondary += secondaryAppendage;
    }

    function add(primaryAppendage) {
    	addSecondary(primaryAppendage, primaryAppendage);
    }

    function addCompressedDouble(c, encoded) {
    	if(token[pos + 1] == c)
    		pos++;
    	add(encoded || c);
    }

    function handleD() {
    	if(token.substring(pos, pos + 2) == 'DG') {
    		if(['I', 'E', 'Y'].indexOf(token[pos + 2]) > -1)  {
    			add('J');
    			pos += 2;
    		} else {
    			add('TK');
    			pos++;
    		}
	    } else if(token.substring(pos, pos + 2) == 'DT') {
    		add('T');
	    	pos++;    		
    	} else
    		addCompressedDouble('D', 'T');
    }

    function handleH() {
		// keep if starts a word or is surrounded by vowels
		if((pos == 0 || isVowel(token[pos - 1])) && isVowel(token[pos + 1])) {
			add('H');
			pos++;
		}    	
    }    

    function handleL() {
    	if(token[pos + 1] == 'L') {
    		if(pos == token.length - 3 && (
    					['ILLO', 'ILLA', 'ALLE'].indexOf(token.substring(pos - 1, pos + 3)) > -1 || (
    						token.substring(pos - 1, pos + 3) == 'ALLE' &&
    						(['AS', 'OS'].indexOf(token.substring(token.length - 2, token.length - 1)) > -1 ||
    						['A', 'O'].indexOf(token[token.length - 1]) > -1)
    					))) {
    			addSecondary('L', '');
    			pos++;
    			return;
    		}
    		pos++;	
    	}
    	add('L');
    }

    function handleM() {
    	addCompressedDouble('M');
    	if(token[pos - 1] == 'U' && token[pos + 1] == 'B' && 
    			((pos == token.length - 2  || token.substring(pos + 2, pos + 4) == 'ER')))
    		pos++;
    }

    function handleP() {
    	if(token[pos + 1] == 'H') {
    		add('F');
    		pos++;	
    	} else {
    		addCompressedDouble('P');
    		    		
			if(token[pos + 1] == 'B')
    			pos++;
    	}
    }

    function handleR() {
    	if(pos == token.length - 1 && !slavoGermanic
    			&& token.substring(pos - 2, pos) == 'IE'
    			&& ['ME', 'MA'].indexOf(token.substring(pos - 4, pos - 3)) < 0) {
    		addSecondary('', 'R');
    	} else
	    	addCompressedDouble('R');    		
    }

    function handleX() {
    	if(pos == 0) {
    		add('S');
    	} else if(!(pos == token.length - 1 
	    		&& (['IAU', 'EAU', 'IEU'].indexOf(token.substring(pos - 3, pos)) > -1
	    			|| ['AU', 'OU'].indexOf(token.substring(pos - 2, pos)) > -1))) {
    		add('KS');
    	}
    }

    function handleZ() {
    	if(token[pos + 1] == 'H') {
    		add('J');
    		pos++;
    	} else if(['ZO', 'ZI', 'ZA'].indexOf(token.substring(pos + 1, pos + 3)) > -1 
    			|| (slavoGermanic && pos > 0 && token[pos - 1] != 'T')) {
    		addSecondary('S', 'TS');
    		pos++; 
    	} else
	    	addCompressedDouble('Z', 'S');
    }

    var slavoGermanic = token.match(/(W|K|CZ|WITZ)/);
    spy.slavoGermanic = slavoGermanic;

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
		    case 'B':
		    	addCompressedDouble('B', 'P');
		    	break;
	        case 'Ç':
	            add("S");
	            break;
	        case 'D':
	        	handleD();
	        	break;
	        case 'F': case 'K': case 'N':
	        	addCompressedDouble(token[pos]);
	        	break;
	        case 'H':
	        	handleH();
	        	break;
	        case 'L':
	        	handleL();
	        	break;
	        case 'M':
	        	handleM();
	        	break;
	        case 'Ñ':
	        	add('N');
	        	break;
	        case 'P':
	        	handleP();
	        	break;
	        case 'Q':
	        	addCompressedDouble('Q', 'K');
	        	break;
	        case 'R':
	        	handleR();
	        	break;
	        case 'V':
	        	addCompressedDouble('V', 'F');
	        	break;
	        case 'X':
	        	handleX();
	        	break;
	        case 'Z':
	        	handleZ();
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
