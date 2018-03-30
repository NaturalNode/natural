const fs = require('fs');
const util = require('util');
var parseString = require('xml2js').parseString;

var baseFolder = "/home/hugo/Workspace/pattern/pattern/text/";
//var inputFile = baseFolder + "nl/nl-sentiment.xml";
//var outputFile = baseFolder + "nl/nl-sentiment.json";
//var inputFile = baseFolder + "fr/fr-sentiment.xml";
//var outputFile = baseFolder + "fr/fr-sentiment.json";
//var inputFile = baseFolder + "en/en-sentiment.xml";
//var outputFile = baseFolder + "en/en-sentiment.json";
var inputFile = baseFolder + "it/it-sentiment.xml";
var outputFile = baseFolder + "it/pattern-sentiment-it.json";



var xml = fs.readFileSync(inputFile , 'utf8');
var list = {};

parseString(xml, function (err, result) {
  //console.log(JSON.stringify(result, null, 2));
  console.log(result.sentiment.word.length);
    for(var i =0; i < result.sentiment.word.length; i++){
      console.log(result.sentiment.word[i].$.form);
      list[result.sentiment.word[i].$.form] = result.sentiment.word[i].$;
    }
});

console.log(Object.keys(list).length);

fs.writeFileSync(outputFile, JSON.stringify(list, null, 2));
