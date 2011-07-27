
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