exports.PorterStemmer = require('./stemmers/porter_stemmer')
exports.PorterStemmerFa = require('./stemmers/porter_stemmer_fa')
exports.PorterStemmerFr = require('./stemmers/porter_stemmer_fr')
exports.CarryStemmerFr = require('./stemmers/Carry')
exports.PorterStemmerRu = require('./stemmers/porter_stemmer_ru')
exports.PorterStemmerEs = require('./stemmers/porter_stemmer_es')
exports.PorterStemmerIt = require('./stemmers/porter_stemmer_it')
exports.PorterStemmerNo = require('./stemmers/porter_stemmer_no')
exports.PorterStemmerSv = require('./stemmers/porter_stemmer_sv')
exports.PorterStemmerPt = require('./stemmers/porter_stemmer_pt')
exports.PorterStemmerNl = require('./stemmers/porter_stemmer_nl')
exports.LancasterStemmer = require('./stemmers/lancaster_stemmer')
// StemmerFr and StemmerPl are not stemmers. A Polish stemmer is
// not available, and for French PorterStemmerFr should be used.
// exports.StemmerFr = require('./stemmers/stemmer_fr');
// exports.StemmerPl = require('./stemmers/stemmer_pl');
exports.StemmerJa = require('./stemmers/stemmer_ja')
exports.StemmerId = require('./stemmers/indonesian/stemmer_id')
