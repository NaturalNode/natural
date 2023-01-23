import events from 'events'
import { Stemmer } from '../stemmers'

export interface BayesClassifierClassification {
  label: string
  value: number
}

export type BayesClassifierCallback = (err: any, classifier: BayesClassifier) => void

declare class BayesClassifier {
  events: events.EventEmitter

  constructor (stem?: Stemmer)
  addDocument (text: string, stem: string): void
  addDocument (text: string[], stem: string): void
  train (): void
  classify (observation: string): string
  getClassifications (observation: string): BayesClassifierClassification[]
  save (filename: string, callback: BayesClassifierCallback): void
  static load (filename: string, stemmer: Stemmer | null, callback: BayesClassifierCallback): void
  static restore (classifier: any, stemmer?: Stemmer): BayesClassifier
}

interface LogisticRegressionClassifierClassification {
  label: string
  value: number
}

export type LogisticRegressionCallback = (err: any, result: LogisticRegressionClassifier) => void

declare class LogisticRegressionClassifier {
  events: events.EventEmitter

  addDocument (text: string, stem: string): void
  addDocument (text: string[], stem: string): void
  train (): void
  classify (observation: string): string
  getClassifications (observation: string): LogisticRegressionClassifierClassification[]
  save (filename: string, callback: LogisticRegressionCallback): void
  static load (filename: string, stemmer: Stemmer | null, callback: LogisticRegressionCallback): void
  static restore (classifier: any, stemmer?: Stemmer): LogisticRegressionClassifier
}

interface MaxEntClassifierClassification {
  label: string
  value: number
}

export type MaxEntClassifierCallback = (err: any, result: MaxEntClassifier) => void

declare class MaxEntClassifier {
  sample: Sample
  features: FeatureSet

  constructor (features: FeatureSet, sample: Sample)
  addElement (x: Element): void
  addDocument (context: Context, classification: string, elementClass: Element): void
  train (maxIterations: number, minImprovement: number, approxExpectation: object): void
  getClassifications (b: Context): MaxEntClassifierClassification[]
  classify (b: Context): string
  save (filename: string, callback: MaxEntClassifierCallback): void
  static load (filename: string, elementClass: Element, callback: MaxEntClassifierCallback): void
}

declare class Distribution {
  alpha: number[]
  featureSet: FeatureSet
  sample: Sample

  constructor (alpha: number[], features: FeatureSet, sample: Sample)
  toString (): string
  weight (x: Element): number
  calculateAPriori (x: Element): number
  prepareWeights (): void
  calculateAPosteriori (x: Element): number
  aPosterioriNormalisation (b: Context): number
  prepareAPosterioris (): void
  prepare (): void
  KullbackLieblerDistance (): number
  logLikelihood (): number
  entropy (): number
  checkSum (): number
}

export type FeatureFunction = (x: Element) => number

declare class Feature {
  evaluate: FeatureFunction
  name: string
  parameters: string[]

  constructor (f: FeatureFunction, name: string, parameters: string[])
  apply (x: Element): number
  expectationApprox (p: Distribution, sample: Sample): number
  expectation (p: Distribution, A: string[], B: Context[]): number
  observedExpectation (sample: Sample): number
}

declare class FeatureSet {
  features: Feature[]
  map: object

  addFeature (feature: FeatureFunction): boolean
  featureExists (feature: FeatureFunction): boolean
  getFeatures (): Feature[]
  size (): number
  prettyPrint (): string
}

export type SampleCallback = (err: any, result: Sample) => void

declare class Sample {
  frequencyOfContext: object
  frequency: object
  classes: string[]

  constructor (elements: Element[])
  analyse (): void
  addElement (x: Element): void
  observedProbabilityOfContext (context: Context): number
  observedProbability (x: Element): number
  size (): number
  getClasses (): string[]
  generateFeatures (featureSet: FeatureSet): void
  save (filename: string, callback: SampleCallback): void
  load (filename: string, elementClass: Element, callback: SampleCallback): void
}

declare class Context {
  toString (): string
}

declare class Element {
  constructor (a: any, b: Context)
  key (): string
}

declare class SEElement extends Element {
  generateFeatures (featureSet: FeatureSet): void
}

declare class POSElement extends Element {
  generateFeatures (featureSet: FeatureSet): void
}

declare class GISScaler {
  constructor (featureSet: FeatureSet, sample: Sample)
  calculateMaxSumOfFeatures (): void
  addCorrectionFeature (): void
  run (maxIterations: number, minImprovement: number): Distribution
}

declare class MESentence {
  constructor (data?: string[])
  generateSampleElements (sample: Sample): void
}

declare class MECorpus {
  generateSample (): Sample
  splitInTrainAndTest (percentageTrain: number): [MECorpus, MECorpus]
}
