import {
  NounInflector,
  NounInflectorFr,
  NounInflectorJa,
  PresentVerbInflector
} from 'lib/natural'

describe('inflectors with empty input', function () {
  const cases = [
    { name: 'English nouns', Inflector: NounInflector },
    { name: 'French nouns', Inflector: NounInflectorFr },
    { name: 'Japanese nouns', Inflector: NounInflectorJa },
    { name: 'English present tense verbs', Inflector: PresentVerbInflector }
  ]

  cases.forEach(({ name, Inflector }) => {
    describe(name, function () {
      it('should leave an empty string unchanged when singularizing', function () {
        expect(new Inflector().singularize('')).toBe('')
      })

      it('should leave an empty string unchanged when pluralizing', function () {
        expect(new Inflector().pluralize('')).toBe('')
      })
    })
  })
})
