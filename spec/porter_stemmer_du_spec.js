
var stemmer = require("../lib/natural/stemmers/porter_stemmer_du");
var words = [
  "lichtjes",
  "lichtkranten",
  "lichtkring",
  "lichtkringen",
  "lichtregelsystemen",
  "lichtste",
  "lichtstromende"
]

for (word in words) {
  console.log("Stemming: " + words[word]);
  stemmer.stem(words[word]);
  console.log('\n');
}