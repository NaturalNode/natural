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

var NounInflector = require('../lib/natural/inflectors/fr/noun_inflector'),
    inflector = new NounInflector();

describe('NounInflector', function() {
  describe('.pluralize()', function() {
    describe('should pluralize exception nouns ending by -al', function() {
      expect(inflector.pluralize('carnaval')).toBe('carnavals');
      expect(inflector.pluralize('narval')).toBe('narvals');
      expect(inflector.pluralize('récital')).toBe('récitals');
    });

    describe('should pluralize regular nouns ending by -al', function() {
      expect(inflector.pluralize('amiral')).toBe('amiraux');
      expect(inflector.pluralize('cheval')).toBe('chevaux');
      expect(inflector.pluralize('général')).toBe('généraux');
    });

    describe('should pluralize exception nouns ending by -ail', function() {
      expect(inflector.pluralize('bail')).toBe('baux');
      expect(inflector.pluralize('vitrail')).toBe('vitraux');
      expect(inflector.pluralize('émail')).toBe('émaux');
    });

    describe('should pluralize regular nouns ending by -ail', function() {
      expect(inflector.pluralize('détail')).toBe('détails');
      expect(inflector.pluralize('poitrail')).toBe('poitrails');
      expect(inflector.pluralize('chandail')).toBe('chandails');
    });

    describe('should pluralize exception nouns ending by -il', function() {
      expect(inflector.pluralize('ciel')).toBe('cieux');
      expect(inflector.pluralize('œil')).toBe('yeux');
    });

    describe('should pluralize exception nouns ending by -ou', function() {
      expect(inflector.pluralize('bijou')).toBe('bijoux');
      expect(inflector.pluralize('joujou')).toBe('joujoux');
      expect(inflector.pluralize('hibou')).toBe('hiboux');
    });

    describe('should pluralize regular nouns ending by -ou', function() {
      expect(inflector.pluralize('trou')).toBe('trous');
      expect(inflector.pluralize('bambou')).toBe('bambous');
      expect(inflector.pluralize('toutou')).toBe('toutous');
    });

    describe('should pluralize exception nouns ending by -au', function() {
      expect(inflector.pluralize('berimbau')).toBe('berimbaus');
      expect(inflector.pluralize('landau')).toBe('landaus');
      expect(inflector.pluralize('pilau')).toBe('pilaus');
    });

    describe('should pluralize regular nouns ending by -au', function() {
      expect(inflector.pluralize('cadeau')).toBe('cadeaux');
      expect(inflector.pluralize('beau')).toBe('beaux');
      expect(inflector.pluralize('étau')).toBe('étaux');
    });

    describe('should pluralize exception nouns ending by -eu', function() {
      expect(inflector.pluralize('bleu')).toBe('bleus');
      expect(inflector.pluralize('émeu')).toBe('émeus');
      expect(inflector.pluralize('pneu')).toBe('pneus');
    });

    describe('should pluralize regular nouns ending by -eu', function() {
      expect(inflector.pluralize('pieu')).toBe('pieux');
      expect(inflector.pluralize('lieu')).toBe('lieux');
      expect(inflector.pluralize('feu')).toBe('feux');
    });

    describe('should pluralize regular nouns ending by -eau', function() {
      expect(inflector.pluralize('eau')).toBe('eaux');
      expect(inflector.pluralize('manteau')).toBe('manteaux');
      expect(inflector.pluralize('arbrisseau')).toBe('arbrisseaux');
    });

    describe('should pluralize regular nouns ending by -œu', function() {
      expect(inflector.pluralize('vœu')).toBe('vœux');
    });

    describe('should pluralize regular nouns ending by -s, -x or -z', function() {
      expect(inflector.pluralize('os')).toBe('os');
      expect(inflector.pluralize('cas')).toBe('cas');
      expect(inflector.pluralize('rhinocéros')).toBe('rhinocéros');

      expect(inflector.pluralize('houx')).toBe('houx');
      expect(inflector.pluralize('lynx')).toBe('lynx');
      expect(inflector.pluralize('roux')).toBe('roux');

      expect(inflector.pluralize('gaz')).toBe('gaz');
      expect(inflector.pluralize('quartz')).toBe('quartz');
      expect(inflector.pluralize('quiz')).toBe('quiz');
    });

    describe('should pluralize exception nouns', function() {
      expect(inflector.pluralize('ail')).toBe('aulx');
      expect(inflector.pluralize('bétail')).toBe('bestiaux');
    });

    describe('should pluralize regular nouns', function() {
      expect(inflector.pluralize('chai')).toBe('chais');
      expect(inflector.pluralize('vérité')).toBe('vérités');
      expect(inflector.pluralize('orange')).toBe('oranges');
    });
  });

  describe('.singularize()', function() {
    describe('should singularize regular nouns ending by -aux', function() {
      expect(inflector.singularize('amiraux')).toBe('amiral');
      expect(inflector.singularize('chevaux')).toBe('cheval');
      expect(inflector.singularize('généraux')).toBe('général');
    });

    describe('should singularize exception nouns ending by -aux', function() {
      expect(inflector.singularize('baux')).toBe('bail');
      expect(inflector.singularize('vitraux')).toBe('vitrail');
      expect(inflector.singularize('émaux')).toBe('émail');
    });

    describe('should singularize regular nouns ending by -aux', function() {
      expect(inflector.singularize('cadeaux')).toBe('cadeau');
      expect(inflector.singularize('beaux')).toBe('beau');
      expect(inflector.singularize('étaux')).toBe('étau');
    });

    describe('should singularize nouns with multiple plural forms', function() {
      expect(inflector.singularize('ails')).toBe('ail');
      expect(inflector.singularize('aulx')).toBe('ail');
      expect(inflector.singularize('ciels')).toBe('ciel');
      expect(inflector.singularize('cieux')).toBe('ciel');
      expect(inflector.singularize('œils')).toBe('œil');
      expect(inflector.singularize('yeux')).toBe('œil');
      expect(inflector.singularize('aïeuls')).toBe('aïeul'); // Regular
      expect(inflector.singularize('aïeux')).toBe('aïeul');
      expect(inflector.singularize('bisaïeuls')).toBe('bisaïeul'); // Regular
      expect(inflector.singularize('bisaïeux')).toBe('bisaïeul');
      expect(inflector.singularize('craus')).toBe('crau');
      expect(inflector.singularize('craux')).toBe('crau');
      expect(inflector.singularize('graus')).toBe('grau');
      expect(inflector.singularize('graux')).toBe('grau');
      expect(inflector.singularize('sénaus')).toBe('sénau');
      expect(inflector.singularize('sénaux')).toBe('sénau');
      expect(inflector.singularize('tussaus')).toBe('tussau');
      expect(inflector.singularize('tussaux')).toBe('tussau');
      expect(inflector.singularize('emposieus')).toBe('emposieu');
      expect(inflector.singularize('emposieux')).toBe('emposieu');
      expect(inflector.singularize('richelieus')).toBe('richelieu');
      expect(inflector.singularize('richelieux')).toBe('richelieu');
      //expect(inflector.singularize('feus')).toBe('feu'); // This one is an adjective.
      expect(inflector.singularize('feux')).toBe('feu');
      expect(inflector.singularize('lieus')).toBe('lieu'); // Fish
      expect(inflector.singularize('lieux')).toBe('lieu');
      expect(inflector.singularize('corails')).toBe('corail');
      expect(inflector.singularize('coraux')).toBe('corail');
    });

    describe('should singularize exception nouns ending by -oux', function() {
      expect(inflector.singularize('bijoux')).toBe('bijou');
      expect(inflector.singularize('joujoux')).toBe('joujou');
      expect(inflector.singularize('hiboux')).toBe('hibou');
    });

    describe('should singularize exception nouns ending by -eus', function() {
      expect(inflector.singularize('bleus')).toBe('bleu');
      expect(inflector.singularize('émeus')).toBe('émeu');
      expect(inflector.singularize('pneus')).toBe('pneu');
    });

    describe('should singularize regular nouns ending by -eux', function() {
      expect(inflector.singularize('pieux')).toBe('pieu');
      expect(inflector.singularize('lieux')).toBe('lieu');
      expect(inflector.singularize('feux')).toBe('feu');
    });

    describe('should singularize regular nouns ending by -eaux', function() {
      expect(inflector.singularize('eaux')).toBe('eau');
      expect(inflector.singularize('manteaux')).toBe('manteau');
      expect(inflector.singularize('arbrisseaux')).toBe('arbrisseau');
    });

    describe('should singularize regular nouns ending by -œux', function() {
      expect(inflector.singularize('vœux')).toBe('vœu');
    });

    describe('should singularize regular nouns ending by -s, -x or -z', function() {
      expect(inflector.singularize('cas')).toBe('cas');
      expect(inflector.singularize('os')).toBe('os');
      expect(inflector.singularize('rhinocéros')).toBe('rhinocéros');

      expect(inflector.singularize('houx')).toBe('houx');
      expect(inflector.singularize('lynx')).toBe('lynx');
      expect(inflector.singularize('roux')).toBe('roux');

      expect(inflector.singularize('gaz')).toBe('gaz');
      expect(inflector.singularize('quartz')).toBe('quartz');
      expect(inflector.singularize('quiz')).toBe('quiz');
    });

    describe('should singularize exception nouns', function() {
      expect(inflector.singularize('bestiaux')).toBe('bétail');
    });

    describe('should singularize regular nouns', function() {
      expect(inflector.singularize('chais')).toBe('chai');
      expect(inflector.singularize('vérités')).toBe('vérité');
      expect(inflector.singularize('oranges')).toBe('orange');

      // Exception nouns ending by -als
      expect(inflector.singularize('carnavals')).toBe('carnaval');
      expect(inflector.singularize('narvals')).toBe('narval');
      expect(inflector.singularize('récitals')).toBe('récital');

      // Regular nouns ending by -ails
      expect(inflector.singularize('détails')).toBe('détail');
      expect(inflector.singularize('poitrails')).toBe('poitrail');
      expect(inflector.singularize('chandails')).toBe('chandail');

      // Regular nouns ending by -ous
      expect(inflector.singularize('trous')).toBe('trou');
      expect(inflector.singularize('bambous')).toBe('bambou');
      expect(inflector.singularize('toutous')).toBe('toutou');

      // Exception nouns ending by -aus
      expect(inflector.singularize('berimbaus')).toBe('berimbau');
      expect(inflector.singularize('landaus')).toBe('landau');
      expect(inflector.singularize('pilaus')).toBe('pilau');
    });
  });

  /*
    These tests ensure pluralizing plurals or singularizing singulars
    won't lead to wrong results.
   */
  describe('should pluralize exception nouns ending by -al', function() {
    describe('should pluralize exception nouns ending by -al', function() {
      expect(inflector.pluralize('carnavals')).toBe('carnavals');
      expect(inflector.pluralize('narvals')).toBe('narvals');
      expect(inflector.pluralize('récitals')).toBe('récitals');
    });

    describe('should pluralize regular nouns ending by -al', function() {
      expect(inflector.pluralize('amiraux')).toBe('amiraux');
      expect(inflector.pluralize('chevaux')).toBe('chevaux');
      expect(inflector.pluralize('généraux')).toBe('généraux');
    });

    describe('should pluralize exception nouns ending by -ail', function() {
      expect(inflector.pluralize('baux')).toBe('baux');
      expect(inflector.pluralize('vitraux')).toBe('vitraux');
      expect(inflector.pluralize('émaux')).toBe('émaux');
    });

    describe('should pluralize regular nouns ending by -ail', function() {
      expect(inflector.pluralize('détails')).toBe('détails');
      expect(inflector.pluralize('poitrails')).toBe('poitrails');
      expect(inflector.pluralize('chandails')).toBe('chandails');
    });

    describe('should pluralize exception nouns ending by -il', function() {
      expect(inflector.pluralize('cieux')).toBe('cieux');
      expect(inflector.pluralize('yeux')).toBe('yeux');
    });

    describe('should pluralize exception nouns ending by -ou', function() {
      expect(inflector.pluralize('bijoux')).toBe('bijoux');
      expect(inflector.pluralize('joujoux')).toBe('joujoux');
      expect(inflector.pluralize('hiboux')).toBe('hiboux');
    });

    describe('should pluralize regular nouns ending by -ou', function() {
      expect(inflector.pluralize('trous')).toBe('trous');
      expect(inflector.pluralize('bambous')).toBe('bambous');
      expect(inflector.pluralize('toutous')).toBe('toutous');
    });

    describe('should pluralize exception nouns ending by -au', function() {
      expect(inflector.pluralize('berimbaus')).toBe('berimbaus');
      expect(inflector.pluralize('landaus')).toBe('landaus');
      expect(inflector.pluralize('pilaus')).toBe('pilaus');
    });

    describe('should pluralize regular nouns ending by -au', function() {
      expect(inflector.pluralize('cadeaux')).toBe('cadeaux');
      expect(inflector.pluralize('beaux')).toBe('beaux');
      expect(inflector.pluralize('étaux')).toBe('étaux');
    });

    describe('should pluralize exception nouns ending by -eu', function() {
      expect(inflector.pluralize('bleus')).toBe('bleus');
      expect(inflector.pluralize('émeus')).toBe('émeus');
      expect(inflector.pluralize('pneus')).toBe('pneus');
    });

    describe('should pluralize regular nouns ending by -eu', function() {
      expect(inflector.pluralize('pieux')).toBe('pieux');
      expect(inflector.pluralize('lieux')).toBe('lieux');
      expect(inflector.pluralize('feux')).toBe('feux');
    });

    describe('should pluralize regular nouns ending by -eau', function() {
      expect(inflector.pluralize('eaux')).toBe('eaux');
      expect(inflector.pluralize('manteaux')).toBe('manteaux');
      expect(inflector.pluralize('arbrisseaux')).toBe('arbrisseaux');
    });

    describe('should pluralize regular nouns ending by -œu', function() {
      expect(inflector.pluralize('vœux')).toBe('vœux');
    });

    describe('should pluralize regular nouns ending by -s, -x or -z', function() {
      expect(inflector.pluralize('os')).toBe('os');
      expect(inflector.pluralize('cas')).toBe('cas');
      expect(inflector.pluralize('rhinocéros')).toBe('rhinocéros');

      expect(inflector.pluralize('houx')).toBe('houx');
      expect(inflector.pluralize('lynx')).toBe('lynx');
      expect(inflector.pluralize('roux')).toBe('roux');

      expect(inflector.pluralize('gaz')).toBe('gaz');
      expect(inflector.pluralize('quartz')).toBe('quartz');
      expect(inflector.pluralize('quiz')).toBe('quiz');
    });

    describe('should pluralize exception nouns', function() {
      expect(inflector.pluralize('aulx')).toBe('aulx');
      expect(inflector.pluralize('bestiaux')).toBe('bestiaux');
    });

    describe('should pluralize regular nouns', function() {
      expect(inflector.pluralize('chais')).toBe('chais');
      expect(inflector.pluralize('vérités')).toBe('vérités');
      expect(inflector.pluralize('oranges')).toBe('oranges');
    });
  });

  describe('.singularize()', function() {
    describe('should singularize regular nouns ending by -aux', function() {
      expect(inflector.singularize('amiral')).toBe('amiral');
      expect(inflector.singularize('cheval')).toBe('cheval');
      expect(inflector.singularize('général')).toBe('général');
    });

    describe('should singularize exception nouns ending by -aux', function() {
      expect(inflector.singularize('bail')).toBe('bail');
      expect(inflector.singularize('vitrail')).toBe('vitrail');
      expect(inflector.singularize('émail')).toBe('émail');
    });

    describe('should singularize regular nouns ending by -aux', function() {
      expect(inflector.singularize('cadeau')).toBe('cadeau');
      expect(inflector.singularize('beau')).toBe('beau');
      expect(inflector.singularize('étau')).toBe('étau');
    });

    describe('should singularize nouns with multiple plural forms', function() {
      expect(inflector.singularize('ail')).toBe('ail');
      expect(inflector.singularize('ciel')).toBe('ciel');
      expect(inflector.singularize('œil')).toBe('œil');
      expect(inflector.singularize('aïeul')).toBe('aïeul');
      expect(inflector.singularize('bisaïeul')).toBe('bisaïeul');
      expect(inflector.singularize('crau')).toBe('crau');
      expect(inflector.singularize('grau')).toBe('grau');
      expect(inflector.singularize('sénau')).toBe('sénau');
      expect(inflector.singularize('tussau')).toBe('tussau');
      expect(inflector.singularize('emposieu')).toBe('emposieu');
      expect(inflector.singularize('richelieu')).toBe('richelieu');
      expect(inflector.singularize('feu')).toBe('feu');
      expect(inflector.singularize('lieu')).toBe('lieu'); // Fish
      expect(inflector.singularize('corail')).toBe('corail');
    });

    describe('should singularize exception nouns ending by -oux', function() {
      expect(inflector.singularize('bijou')).toBe('bijou');
      expect(inflector.singularize('joujou')).toBe('joujou');
      expect(inflector.singularize('hibou')).toBe('hibou');
    });

    describe('should singularize exception nouns ending by -eus', function() {
      expect(inflector.singularize('bleu')).toBe('bleu');
      expect(inflector.singularize('émeu')).toBe('émeu');
      expect(inflector.singularize('pneu')).toBe('pneu');
    });

    describe('should singularize regular nouns ending by -eux', function() {
      expect(inflector.singularize('pieu')).toBe('pieu');
      expect(inflector.singularize('lieu')).toBe('lieu');
      expect(inflector.singularize('feu')).toBe('feu');
    });

    describe('should singularize regular nouns ending by -eaux', function() {
      expect(inflector.singularize('eau')).toBe('eau');
      expect(inflector.singularize('manteau')).toBe('manteau');
      expect(inflector.singularize('arbrisseau')).toBe('arbrisseau');
    });

    describe('should singularize regular nouns ending by -œux', function() {
      expect(inflector.singularize('vœu')).toBe('vœu');
    });

    describe('should singularize regular nouns ending by -s, -x or -z', function() {
      expect(inflector.singularize('cas')).toBe('cas');
      expect(inflector.singularize('os')).toBe('os');
      expect(inflector.singularize('rhinocéros')).toBe('rhinocéros');

      expect(inflector.singularize('houx')).toBe('houx');
      expect(inflector.singularize('lynx')).toBe('lynx');
      expect(inflector.singularize('roux')).toBe('roux');

      expect(inflector.singularize('gaz')).toBe('gaz');
      expect(inflector.singularize('quartz')).toBe('quartz');
      expect(inflector.singularize('quiz')).toBe('quiz');
    });

    describe('should singularize exception nouns', function() {
      expect(inflector.singularize('bétail')).toBe('bétail');
    });

    describe('should singularize regular nouns', function() {
      expect(inflector.singularize('chai')).toBe('chai');
      expect(inflector.singularize('vérité')).toBe('vérité');
      expect(inflector.singularize('orange')).toBe('orange');

      // Exception nouns ending by -als
      expect(inflector.singularize('carnaval')).toBe('carnaval');
      expect(inflector.singularize('narval')).toBe('narval');
      expect(inflector.singularize('récital')).toBe('récital');

      // Regular nouns ending by -ails
      expect(inflector.singularize('détail')).toBe('détail');
      expect(inflector.singularize('poitrail')).toBe('poitrail');
      expect(inflector.singularize('chandail')).toBe('chandail');

      // Regular nouns ending by -ous
      expect(inflector.singularize('trou')).toBe('trou');
      expect(inflector.singularize('bambou')).toBe('bambou');
      expect(inflector.singularize('toutou')).toBe('toutou');

      // Exception nouns ending by -aus
      expect(inflector.singularize('berimbau')).toBe('berimbau');
      expect(inflector.singularize('landau')).toBe('landau');
      expect(inflector.singularize('pilau')).toBe('pilau');
    });
  });

  describe('.attach()', function() {
    describe('should attach new methods to String', function() {
      inflector.attach();
      expect('corail'.pluralizeNoun()).toBe('coraux');
      expect('coraux'.singularizeNoun()).toBe('corail');
      expect('récital'.pluralizeNoun()).toBe('récitals');
      expect('récitals'.singularizeNoun()).toBe('récital');
    });
  });
});
