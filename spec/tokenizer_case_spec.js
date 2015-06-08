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

var Tokenizer = require('../lib/natural/tokenizers/tokenizer_case.js'),
  tokenizer = new Tokenizer();

describe('case_tokenizer_numbers', function() {
  it('should tokenize numbers', function() {
    expect(tokenizer.tokenize('0 1 2 3 4 5 6 7 8 9 10')).toEqual(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });
});

describe('case_tokenizer_es', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('hola yo me llamo eduardo y esudié ingeniería')).toEqual(['hola', 'yo', 'me', 'llamo', 'eduardo', 'y', 'esudié', 'ingeniería']);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('hola yo me llamo eduardo y esudié ingeniería'.tokenize()).toEqual(['hola', 'yo', 'me', 'llamo', 'eduardo', 'y', 'esudié', 'ingeniería']);
  });

});

describe('case_tokenizer_fr', function() {

  var text = "Affectueusement surnommé « Gabo » dans toute l'Amérique latine, le Colombien Gabriel Garcia Marquez, prix Nobel de littérature 1982, l'un des plus grands écrivains du XXe siècle, est mort À son domicile de Mexico jeudi 17 avril. Il était âgé de 87 ans. Son Œuvre a été traduite dans toutes les langues ou presque, et vendue à quelque 50 millions d'exemplaires.";

  var tokenized = [ 'Affectueusement',
    'surnommé',
    'Gabo',
    'dans',
    'toute',
    'l',
    'Amérique',
    'latine',
    'le',
    'Colombien',
    'Gabriel',
    'Garcia',
    'Marquez',
    'prix',
    'Nobel',
    'de',
    'littérature',
    '1982',
    'l',
    'un',
    'des',
    'plus',
    'grands',
    'écrivains',
    'du',
    'XXe',
    'siècle',
    'est',
    'mort',
    'À',
    'son',
    'domicile',
    'de',
    'Mexico',
    'jeudi',
    '17',
    'avril',
    'Il',
    'était',
    'âgé',
    'de',
    '87',
    'ans',
    'Son',
    'Œuvre',
    'a',
    'été',
    'traduite',
    'dans',
    'toutes',
    'les',
    'langues',
    'ou',
    'presque',
    'et',
    'vendue',
    'à',
    'quelque',
    '50',
    'millions',
    'd',
    'exemplaires' ];

  it('should tokenize strings', function() {
    expect(tokenizer.tokenize(text)).toEqual(tokenized);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect(text.tokenize()).toEqual(tokenized);
  });

});

describe('case_tokenizer_nl', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('\'s Morgens is het nog erg koud, vertelde de weerman over een van de radio\'s', true)).toEqual(['\'s','Morgens','is','het','nog','erg','koud','vertelde','de','weerman','over','een','van','de','radio\'s']);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('\'s Morgens is het nog erg koud, vertelde de weerman over een van de radio\'s'.tokenize(true)).toEqual(['\'s','Morgens','is','het','nog','erg','koud','vertelde','de','weerman','over','een','van','de','radio\'s']);
  });

});

describe('case_tokenizer_pt', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('isso é coração')).toEqual(['isso', 'é', 'coração']);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('isso é coração'.tokenize()).toEqual(['isso', 'é', 'coração']);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('isso é coração'.tokenize()).toEqual(['isso', 'é', 'coração']);
  });

  it('should swollow punctuation', function() {
    expect(tokenizer.tokenize('isso é coração, no')).toEqual(['isso', 'é', 'coração', 'no']);
  });

  it('should swollow final punctuation', function() {
    expect(tokenizer.tokenize('isso é coração, no?')).toEqual(['isso', 'é', 'coração', 'no']);
  });

  it('should swollow initial punctuation', function() {
    expect(tokenizer.tokenize('.isso é coração, no')).toEqual(['isso', 'é', 'coração', 'no']);
  });

  it('should swollow duplicate punctuation', function() {
    expect(tokenizer.tokenize('eu vou... pause')).toEqual(['eu', 'vou', 'pause']);
  });
});

describe('case_tokenizer_aggressive_tokenizer', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('these are things')).toEqual(['these', 'are', 'things']);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('these are things'.tokenize()).toEqual(['these', 'are', 'things']);
  });

  it('should tokenize strings via attached string method', function() {
    tokenizer.attach();
    expect('these are things'.tokenize()).toEqual(['these', 'are', 'things']);
  });

  it('should swollow punctuation', function() {
    expect(tokenizer.tokenize('these are things, no')).toEqual(['these', 'are', 'things', 'no']);
  });

  it('should swollow final punctuation', function() {
    expect(tokenizer.tokenize('these are things, no?')).toEqual(['these', 'are', 'things', 'no']);
  });

  it('should swollow initial punctuation', function() {
    expect(tokenizer.tokenize('.these are things, no')).toEqual(['these', 'are', 'things', 'no']);
  });

  it('should swollow duplicate punctuation', function() {
    expect(tokenizer.tokenize('i shal... pause')).toEqual(['i', 'shal', 'pause']);
  });
});

describe('case_tokenizer_it', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Mi piacerebbe visitare l\'Italia un giorno di questi!')).toEqual(['Mi', 'piacerebbe', 'visitare', 'l', 'Italia', 'un', 'giorno', 'di', 'questi']);
  });
});

describe('case_tokenizer_no', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Gå rett fram. Så tek du til venstre/høgre.')).toEqual(['Gå', 'rett', 'fram', 'Så', 'tek', 'du', 'til', 'venstre', 'høgre']);
  });
});

// Made up tests from here. No idea but seem to work.

describe('case_tokenizer_pl', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Bardzo za tobą tęskniłem/tęskniłam!')).toEqual(['Bardzo', 'za', 'tobą', 'tęskniłem', 'tęskniłam']);
  });
});

describe('case_tokenizer_pt', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Siga em frente, depois vire à esquerda/direita!')).toEqual(['Siga', 'em', 'frente', 'depois', 'vire', 'à', 'esquerda', 'direita']);
  });
});

describe('case_tokenizer_ru', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Vy mOzhite mne pamOch? Вы можете мне помочь?')).toEqual(['Vy', 'mOzhite', 'mne', 'pamOch', 'Вы', 'можете', 'мне', 'помочь']);
  });
});

describe('case_tokenizer_fi', function() {
  it('should tokenize strings', function() {
    expect(tokenizer.tokenize('Mene suoraan käänny sitten vasempaan/oikeaan!')).toEqual(['Mene', 'suoraan', 'käänny', 'sitten', 'vasempaan', 'oikeaan']);
  });
});