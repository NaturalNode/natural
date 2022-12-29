import {
  Lexicon,
  RuleSet,
  BrillPOSTagger
} from '../lib/natural/brill_pos_tagger'

const rulesFilename = './data/English/tr_from_posjs.json'
const lexiconFilename = './data/English/lexicon_from_posjs.json'
const defaultCategory = 'N'

const lexicon = new Lexicon(lexiconFilename, defaultCategory)
const rules = new RuleSet(rulesFilename)
const tagger = new BrillPOSTagger(lexicon, rules)

const sentence = ['I', 'see', 'the', 'man', 'with', 'the', 'telescope']
const taggedSentence = tagger.tag(sentence)
console.log(taggedSentence.taggedWords)
