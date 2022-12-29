
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
  static load (filename: string, stemmer: Stemmer, callback: BayesClassifierCallback): void
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
  static load (filename: string, stemmer: Stemmer, callback: LogisticRegressionCallback): void
  static restore (classifier: any, stemmer?: Stemmer): LogisticRegressionClassifier
}

export type MaxEntClassifierCallback = (err: any, result: MaxEntClassifier) => void

declare class MaxEntClassifier {
  sample: Sample
  features: FeatureSet

  constructor (features: FeatureSet, sample: Sample)
  addElement (x: Element): void
  addDocument (context: Context, classification: string, elementClass: Element): void
  train (maxIterations: number, minImprovement: number, approxExpectation: object): void
  getClassifications (b: Context): array
  classify (b: Context): string
  save (filename: string, callback: MaxEntClassifierCallback): void
  static load (filename: string, elementClass: Element, callback: MaxEntClassifierCallback): void
}

export type FeatureFunction = (x: Element) => number

declare class Feature {
  evaluate: FeatureFunction
  name: string
  parameters: array

  constructor (f: FeatureFunction, name: string, parameters: array)
  apply (x: Element): number
  expectationApprox (p: Distribution, sample: Sample): number
  expectation (p: Distribution, A: array, B: array): number
  observedExpectation (sample: Sample): number
}

declare class FeatureSet {
  features: array
  map: object

  addFeature (feature: FeatureFunction): boolean
  featureExists (feature: FeatureFunction): boolean
  getFeatures (): array
  size (): number
  prettyPrint (): string
}

export type SampleCallback = (err: any, result: Sample) => void

declare class Sample {
  frequencyOfContext: object
  frequency: object
  classes: array

  constructor (elements)
  analyse (): void
  addElement (x: Element): void
  observedProbabilityOfContext (context: Context): number
  observedProbability (x): number
  size (): number
  getClasses (): array
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
  constructor (data: array): void
  generateSampleElements (sample: Sample): void
}

declare class MECorpus {
  generateSample (): Sample
  splitInTrainAndTest (percentageTrain: number): array
}
