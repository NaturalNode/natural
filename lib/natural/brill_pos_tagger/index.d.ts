/*
Copyright (c) 2022,
Dylan R. E. Moonfire <https://github.com/dmoonfire>,
Emily Marigold Klassen <https://github.com/forivall>,
Hugo W.L. ter Doest <https://github.com/Hugo-ter-Doest>

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

import { Feature } from '../classifiers'

declare interface RuleTemplatesItem {
  function: (sentence: Sentence, i: number, parameter1?: string, parameter2?: string) => boolean
  window: number[]
  nrParameters: number
  parameter1Values?: (sentence: Sentence, i: number) => string[]
  parameter2Values?: (sentence: Sentence, i: number) => string[]
}

export interface RuleTemplates {
  [key: string]: RuleTemplatesItem | undefined
}

export class RuleTemplate {
  constructor (templateName: string, metadata: RuleTemplatesItem)
  windowFitsSite (sentence: Sentence, i: number): void
}

declare class Predicate {
  constructor (name: string, parameter1: string, parameter2?: string)
  name: string
  parameter1: string
  parameter2: string | undefined
  meta: RuleTemplatesItem
  evaluate (sentence: Sentence, position: number): boolean
}

declare class TransformationRule {
  constructor (c1: string, c2: string, predicate: string, parameter1: string, parameter2?: string)
  literal: string[]
  predicate: Predicate
  old_category: string
  new_category: string
  neutral: number
  positive: number
  negative: number
  hasBeenSelectedAsHighRuleBefore: boolean
  key (): string
  apply (sentence: Sentence, position: number): void
  isApplicableAt (sentence: Sentence, taggedSentence: Sentence, i: number): boolean
  prettyPrint (): string
  applyAt (sentence: Sentence, position: number): void
  score (): number
}

export class RuleSet {
  constructor (language: string)
  rules: TransformationRule[]
  addRule (rule: TransformationRule): boolean
  removeRule (rule: TransformationRule): void
  getRules (): TransformationRule[]
  nrRules (): number
  hasRule (rule: TransformationRule): boolean
  prettyPrint (): string
}

export class Lexicon {
  constructor (language: string, defaultCategory: string, defaultCategoryCapitalised?: string)
  lexicon: { [key: string]: string[] | undefined }
  defaultCategory: string
  defaultCategoryCapitalised: string | undefined
  parseLexicon (data: string): void
  tagWordWithDefaults (word: string): string
  tagWord (word: string): string[]
  addWord (word: string, categories: string[]): void
  prettyPrint (): string
  nrEntries (): number
  size (): number
  setDefaultCategories (category: string, categoryCapitalised: string): void
}

declare class Corpus {
  constructor (data: string | Corpus, typeOfCorpus: number, SentenceClass: typeof Sentence)
  private readonly wordCount: number
  private readonly sentences: Sentence[]
  private readonly tagFrequencies: { [key: string]: string[] | undefined }
  private readonly posTags: { [key: string]: string[] | undefined }
  parseBrownCorpus (data: string, SentenceClass: typeof Sentence): void
  getTags (): string[]
  splitInTrainAndTest (percentageTrain: number): [Corpus, Corpus]
  analyse (): void
  buildLexicon (): Lexicon
  tag (lexicon: Lexicon): void
  nrSentences (): number
  nrWords (): number
  private generateFeatures (): Feature[]
  // Incomplete method:
  // prettyPrint
}

declare interface BrillPOSTaggedWord {
  token: string
  tag: string
}

export class Sentence {
  constructor (data?: string[])
  taggedWords: BrillPOSTaggedWord[]
  addTaggedWord (token: string, tag: string): void
  clone (): Sentence
}

export class BrillPOSTagger {
  constructor (lexicon: Lexicon, ruleSet: RuleSet)
  private readonly lexicon: Lexicon
  private readonly ruleSet: RuleSet
  tag (sentence: string[]): Sentence
  tagWithLexicon (sentence: string[]): Sentence
  applyRules (sentence: Sentence): Sentence
}

export class BrillPOSTester {
  constructor (lexicon: Lexicon, ruleSet: RuleSet)
  private readonly lexicon: Lexicon
  private readonly ruleSet: RuleSet
  test (corpus: Corpus, tagger: BrillPOSTagger): [number, number]
}

export class BrillPOSTrainer {
  constructor (ruleScoreThreshold: number)
  private readonly ruleScoreThreshold: number
  private readonly corpus: Corpus
  private readonly templates: RuleTemplates
  private readonly positiveRules: RuleSet
  private readonly mapRuleToSites: { [key: string]: { [key: number ]: { [key: number ]: boolean | undefined } | undefined } | undefined }
  private readonly mapSiteToRules: { [key: number]: { [key: number ]: { [key: string ]: TransformationRule | undefined } | undefined } | undefined }
  private selectHighRule (): TransformationRule
  private mapRuleToSite (rule: TransformationRule, i: number, j: number): void
  private mapSiteToRule (i: number, j: number, rule: TransformationRule): void
  private associateSiteWithRule (i: number, j: number, rule: TransformationRule): void
  private siteIsAssociatedWithRule (i: number, j: number, rule: TransformationRule): boolean
  private getSites (rule: TransformationRule): Array<[number, number]>
  private getRules (i: number, j: number): TransformationRule[]
  private disconnectSiteFromRule (i: number, j: number, rule: TransformationRule): void
  private scoreRule (rule: TransformationRule, i: number, j: number): void
  private generatePositiveRules (i: number, j: number): RuleSet
  private scanForPositiveRules (): void
  private scanForSites (): void
  private neighbourhood (i: number, j: number): Array<[number, number]>
  train (corpus: Corpus, templates: RuleTemplates, lexicon: Lexicon): RuleSet
  printRulesWithScores (): string
}
