import { PorterStemmer } from '../lib/natural/stemmers'
import { SentimentAnalyzer } from '../lib/natural/sentiment'

var stemmer = PorterStemmer
var analyzer = new SentimentAnalyzer('English', stemmer, 'afinn')
console.log(analyzer.getSentiment(['I', 'like', 'cherries']))
// 0.6666666666666666
