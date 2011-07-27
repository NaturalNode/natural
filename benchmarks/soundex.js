
// single word

suite.bench('soundex() word', function(next){
  soundex('stephen');
  next();
});

// small body of text

var words = fs.readFileSync('lib/natural/index.js', 'utf8').split(/\W+/);
suite.bench('soundex() small', function(next){
  for (var i = 0, len = words.length; i < len; ++i) {
    soundex(words[i]);
  }
  next();
});

// medium body of text

var words2 = fs.readFileSync('README.md', 'utf8').split(/\W+/);
suite.bench('soundex() medium', function(next){
  for (var i = 0, len = words2.length; i < len; ++i) {
    soundex(words2[i]);
  }
  next();
});