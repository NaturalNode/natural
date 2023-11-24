import {
  CarryStemmerFr,
  LancasterStemmer,
  PorterStemmer,
  PorterStemmerEs,
  PorterStemmerFa,
  PorterStemmerFr,
  PorterStemmerIt,
  PorterStemmerNl,
  PorterStemmerNo,
  PorterStemmerPt,
  PorterStemmerRu,
  PorterStemmerUk,
  PorterStemmerSv,
  StemmerId,
  StemmerJa
} from '../lib/natural'

// Carry stemmers
console.log(CarryStemmerFr.stem('jugaría'))

// Lancaster stemmers
console.log(LancasterStemmer.stem('words'))

// Porter stemmers
console.log(PorterStemmer.stem('words')) // stem a single word
console.log(PorterStemmerEs.stem('jugaría'))
console.log(PorterStemmerFa.stem('jugaría'))
console.log(PorterStemmerFr.stem('jugaría'))
console.log(PorterStemmerIt.stem('jugaría'))
console.log(PorterStemmerNl.stem('tulp'))
console.log(PorterStemmerNo.stem('jugaría'))
console.log(PorterStemmerPt.stem('jugaría'))
console.log(PorterStemmerRu.stem('весною'))
console.log(PorterStemmerRu.stem('падший'))
console.log(PorterStemmerSv.stem('Riksdag'))

// Other stemmers
console.log(StemmerId.stem('mie'))
console.log(StemmerJa.stem('言葉'))
