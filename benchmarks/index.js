
/**
 * Module dependencies.
 */

var uubench = require('uubench')
  , natural = require('../');

var fs = require('fs');
var metaphone = natural.Metaphone.process;
var soundex = natural.SoundEx.process;

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

require('./metaphone');
require('./soundex');

suite.run();
