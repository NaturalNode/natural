import {
  TaggedSentence,
  SentenceAnalyzer } from '../lib/natural/analyzers'

const sentenceTags: TaggedSentence = {
  tags: [
    { token: 'The', pos: 'DT' },
    { token: 'angry', pos: 'JJ' },
    { token: 'bear', pos: 'NN' },
    { token: 'chased', pos: 'VB' },
    { token: 'the', pos: 'DT' },
    { token: 'frightened', pos: 'JJ' },
    { token: 'little', pos: 'JJ' },
    { token: 'squirrel', pos: 'NN' },
    { token: '.', pos: '.'}
  ],
  punct: function () { return [] }
}

new SentenceAnalyzer(sentenceTags, function (analyzer) {
  analyzer.part(function (part) {
    console.log(JSON.stringify(part, null, 2))
  })
  analyzer.type(function (type) {
    console.log(JSON.stringify(type, null, 2))
  })
})
