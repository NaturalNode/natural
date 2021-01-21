/*
Copyright (c) 2017, Dogan Yazar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict'

// a list of commonly used words that have little meaning and can be excluded
// from analysis.
const words = ['aderton', 'adertonde', 'adjö', 'aldrig', 'alla', 'allas', 'allt', 'alltid',
  'alltså', 'andra', 'andras', 'annan', 'annat', 'artonde', 'artonn', 'att', 'av', 'bakom',
  'bara', 'behöva', 'behövas', 'behövde', 'behövt', 'beslut', 'beslutat', 'beslutit', 'bland',
  'blev', 'bli', 'blir', 'blivit', 'bort', 'borta', 'bra', 'bäst', 'bättre', 'båda', 'bådas',
  'dag', 'dagar', 'dagarna', 'dagen', 'de', 'del', 'delen', 'dem', 'den', 'denna', 'deras',
  'dess', 'dessa', 'det', 'detta', 'dig', 'din', 'dina', 'dit', 'ditt', 'dock', 'dom', 'du',
  'där', 'därför', 'då', 'e', 'efter', 'eftersom', 'ej', 'elfte', 'eller', 'elva', 'emot', 'en',
  'enkel', 'enkelt', 'enkla', 'enligt', 'ens', 'er', 'era', 'ers', 'ert', 'ett', 'ettusen',
  'fanns', 'fem', 'femte', 'femtio', 'femtionde', 'femton', 'femtonde', 'fick', 'fin',
  'finnas', 'finns', 'fjorton', 'fjortonde', 'fjärde', 'fler', 'flera', 'flesta', 'fram',
  'framför', 'från', 'fyra', 'fyrtio', 'fyrtionde', 'få', 'får', 'fått', 'följande', 'för',
  'före', 'förlåt', 'förra', 'första', 'genast', 'genom', 'gick', 'gjorde', 'gjort', 'god',
  'goda', 'godare', 'godast', 'gott', 'gälla', 'gäller', 'gällt', 'gärna', 'gå', 'går', 'gått',
  'gör', 'göra', 'ha', 'hade', 'haft', 'han', 'hans', 'har', 'heller', 'hellre', 'helst', 'helt',
  'henne', 'hennes', 'hit', 'hon', 'honom', 'hundra', 'hundraen', 'hundraett', 'hur', 'här',
  'hög', 'höger', 'högre', 'högst', 'i', 'ibland', 'icke', 'idag', 'igen', 'igår', 'imorgon',
  'in', 'inför', 'inga', 'ingen', 'ingenting', 'inget', 'innan', 'inne', 'inom', 'inte',
  'inuti', 'ja', 'jag', 'jo', 'ju', 'just', 'jämfört', 'kan', 'kanske', 'knappast', 'kom',
  'komma', 'kommer', 'kommit', 'kr', 'kunde', 'kunna', 'kunnat', 'kvar', 'legat', 'ligga',
  'ligger', 'lika', 'likställd', 'likställda', 'lilla', 'lite', 'liten', 'litet', 'länge',
  'längre', 'längst', 'lätt', 'lättare', 'lättast', 'långsam', 'långsammare', 'långsammast',
  'långsamt', 'långt', 'låt', 'man', 'med', 'mej', 'mellan', 'men', 'mer', 'mera', 'mest', 'mig',
  'min', 'mina', 'mindre', 'minst', 'mitt', 'mittemot', 'mot', 'mycket', 'många', 'måste',
  'möjlig', 'möjligen', 'möjligt', 'möjligtvis', 'ned', 'nederst', 'nedersta', 'nedre',
  'nej', 'ner', 'ni', 'nio', 'nionde', 'nittio', 'nittionde', 'nitton', 'nittonde', 'nog',
  'noll', 'nr', 'nu', 'nummer', 'när', 'nästa', 'någon', 'någonting', 'något', 'några', 'nån',
  'nånting', 'nåt', 'nödvändig', 'nödvändiga', 'nödvändigt', 'nödvändigtvis', 'och', 'också',
  'ofta', 'oftast', 'olika', 'olikt', 'om', 'oss', 'på', 'rakt', 'redan', 'rätt', 'sa', 'sade',
  'sagt', 'samma', 'sedan', 'senare', 'senast', 'sent', 'sex', 'sextio', 'sextionde', 'sexton',
  'sextonde', 'sig', 'sin', 'sina', 'sist', 'sista', 'siste', 'sitt', 'sitta', 'sju', 'sjunde',
  'sjuttio', 'sjuttionde', 'sjutton', 'sjuttonde', 'själv', 'sjätte', 'ska', 'skall', 'skulle',
  'slutligen', 'små', 'smått', 'snart', 'som', 'stor', 'stora', 'stort', 'större', 'störst',
  'säga', 'säger', 'sämre', 'sämst', 'så', 'sådan', 'sådana', 'sådant', 'ta', 'tack', 'tar',
  'tidig', 'tidigare', 'tidigast', 'tidigt', 'till', 'tills', 'tillsammans', 'tio', 'tionde',
  'tjugo', 'tjugoen', 'tjugoett', 'tjugonde', 'tjugotre', 'tjugotvå', 'tjungo', 'tolfte',
  'tolv', 'tre', 'tredje', 'trettio', 'trettionde', 'tretton', 'trettonde', 'två', 'tvåhundra',
  'under', 'upp', 'ur', 'ursäkt', 'ut', 'utan', 'utanför', 'ute', 'va', 'vad', 'var', 'vara',
  'varför', 'varifrån', 'varit', 'varje', 'varken', 'vars', 'varsågod', 'vart', 'vem', 'vems',
  'verkligen', 'vi', 'vid', 'vidare', 'viktig', 'viktigare', 'viktigast', 'viktigt', 'vilka',
  'vilkas', 'vilken', 'vilket', 'vill', 'väl', 'vänster', 'vänstra', 'värre', 'vår', 'våra',
  'vårt', 'än', 'ännu', 'är', 'även', 'åt', 'åtminstone', 'åtta', 'åttio', 'åttionde',
  'åttonde', 'över', 'övermorgon', 'överst', 'övre', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', '0']

// tell the world about the noise words.
exports.words = words
