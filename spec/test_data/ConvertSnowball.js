var fs = require('fs');
var inputFile = './spec/test_data/snowball_it.txt';
var outputFile = './spec/test_data/snowball_it.json';

var data = fs.readFileSync(inputFile, 'utf8');

var lines = data.split(/[\n\r]+/);
var dict = {};
lines.forEach(line => {
  //[word, stem] = line.split(/\s+/);
  [word, stem] = line.split(' -> ');
  console.log(word + ": " + stem);
  dict[word] = stem;
});

fs.writeFileSync(outputFile, JSON.stringify(dict, null, 2));

