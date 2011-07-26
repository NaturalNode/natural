
/**
 * Module dependencies.
 */

var uubench = require('uubench')
  , natural = require('./')
  , metaphone = natural.Metaphone.process
  , fs = require('fs');

var suite = new uubench.Suite({
  start: function(){
    console.log();
  },

  result: function(name, stats){
    var persec = 1000 / stats.elapsed
      , ops = stats.iterations * persec;
    console.log('  \033[90m%s : \033[36m%s \033[90mops/s\033[0m', name, ops | 0);
  },
  
  done: function(){
    console.log();
  }
});

// single word

suite.bench('metaphone() word', function(next){
  metaphone('stephen');
  next();
});

// small body of text

var words = fs.readFileSync('lib/natural/index.js', 'utf8').split(/\W+/);
suite.bench('metaphone() small', function(next){
  for (var i = 0, len = words.length; i < len; ++i) {
    metaphone(words[i]);
  }
  next();
});

// medium body of text

var words2 = fs.readFileSync('README.md', 'utf8').split(/\W+/);
suite.bench('metaphone() medium', function(next){
  for (var i = 0, len = words2.length; i < len; ++i) {
    metaphone(words2[i]);
  }
  next();
});

suite.run();