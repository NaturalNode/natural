
var fs = require('fs');
var natural = require('../lib/natural');
var stemmer = new natural.PorterStemmer();
var config = natural.config;

describe('Generic Porter stemmer works with multiple languages', function() {

  describe('Generic Porter stemmer works with English', function() {
    
    var stopwords = require('../lib/natural/util/stopwords');
    config.setLanguage("EN");

    it('should tokenize and stem attached', function() {
      stemmer.attach();
      expect('scoring stinks'.tokenizeAndStem()).toEqual(['score', 'stink']);
      expect('SCORING STINKS'.tokenizeAndStem()).toEqual(['score', 'stink']);
    });

    it('should tokenize and stem ignoring stopwords', function() {
      expect('My dog is very fun TO play with And another thing, he is A poodle.'.tokenizeAndStem()).
        toEqual(['dog', 'fun', 'plai', 'thing', 'poodl']);
    });

    it('should tokenize and stem ignoring all capital stopwords', function() {
      var allCapitalStopwords = stopwords.words.join(' ').toUpperCase();
      expect(allCapitalStopwords.tokenizeAndStem()).toEqual([]);
    });

    it('should tokenize and stem including stopwords', function() {
      expect('My dog is very fun TO play with And another thing, he is A poodle.'.tokenizeAndStem(true)).
        toEqual(['my', 'dog', 'is', 'veri', 'fun', 'to', 'plai', 'with', 'and', 'anoth', 'thing', 'he', 'is', 'a', 'poodl']);
    });
    
  });


  describe('Generic Porter stemmer works with Portuguese', function() {

    it('should perform stemming on a lot of words', function() {
      config.setLanguage("PT");
      stemmer.attach();
      
      var errors = [];

      fs.readFileSync('spec/test_data/snowball_pt.txt').toString().split('\n').forEach(function(line) {
        if (line) {
          var fields = line.replace(/\s+/g, ' ').split(' '),
            stemmed = stemmer.stem(fields[0]);

          if (stemmed !== fields[1]) {
            console.log('Error:', fields[0], 'Expected:', fields[1], 'Got:', stemmed);
            errors.push({
              word:     fields[0],
              expected: fields[1],
              actual:   stemmed
            });
          }
        }
      });

      expect(errors.length).toBe(0);
    });
  });
  
});