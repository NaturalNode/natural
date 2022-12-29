import { PorterStemmer } from '../lib/natural/stemmers'
import { SentimentAnalyzer } from '../lib/natural/sentiment'

const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn')
console.log(analyzer.getSentiment(['I', 'like', 'cherries']))
// 0.6666666666666666
