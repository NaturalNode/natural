


var fs = require('fs');

var inputFile = "./spec/test_data/Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.txt";
var outputFile = "./spec/test_data//Volkskrant-20150205-Knot-geldpers-aanzetten-is-paardenmiddel-voor-half-procent-inflatie.json";

var data = fs.readFileSync(inputFile, 'utf8');

var struct = {
  text: data
};

fs.writeFileSync(outputFile, JSON.stringify(struct));
