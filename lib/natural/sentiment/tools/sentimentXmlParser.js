const fs = require('fs');
const util = require('util');
var parseString = require('xml2js').parseString;

var xml = fs.readFileSync('senticon.ca.xml', 'utf8');

var list = {};

parseString(xml, function (err, result) {
    for(var i =0; i < result.senticon.layer.length; i++){
        for(var j = 0; j < result.senticon.layer[i].positive[0].lemma.length; j++){
            //console.log(util.inspect(result.senticon.layer[i].negative[0].lemma[j], false, null))
            list[result.senticon.layer[i].positive[0].lemma[j]._] = result.senticon.layer[i].positive[0].lemma[j].$;
        }
        for(var n = 0; n < result.senticon.layer[i].negative[0].lemma.length; n++){
            list[result.senticon.layer[i].negative[0].lemma[n]._] = result.senticon.layer[i].negative[0].lemma[n].$;
        }
    }
});

var listTrimmed = {};

for(var token in list){
    listTrimmed[token.replace(/ /gi, "").replace(/_/gi, " ")] = list[token]
}
console.log(listTrimmed);
//console.log(util.inspect(list, false, null))
console.log(Object.keys(listTrimmed).length);

fs.writeFileSync('senticon_ca.json', JSON.stringify(listTrimmed, null, 2));
