import events from 'events'
import { Corpus, Sentence } from '../brill_pos_tagger'
import { Stemmer } from '../stemmers'

// Start apparatus declarations

// TODO: Once TS declarations are available in NaturalNode/apparatus,
// replace local definitions with imports:
// import {
//   BayesClassifier as ApparatusBayesClassifier,
//   Classification as ApparatusClassification,
//   Classifier as ApparatusClassifier,
//   LogisticRegressionClassifier as ApparatusLogisticRegressionClassifier,
//   Observation as ApparatusObservation,
// } from 'apparatus'

export interface ApparatusClassification {
  label: string
  value: number
}

export type ApparatusObservation = number[] | { [key: string]: number | string | boolean | undefined }

declare class ApparatusClassifier {
  addExample (observation: ApparatusObservation, label: string): void
  classify (observation: ApparatusObservation): string
  train (): void
  static restore (classifier: string | ApparatusClassifier): ApparatusClassifier
}

// TODO: Not needed for natural repository, but could be moved to
// aparatus repository. Temporarily leaving here for copypasta.
declare class ApparatusBayesClassifier extends ApparatusClassifier {
  classFeatures: { [key: string]: { [key: number]: number | undefined } | undefined }
  classTotals: { [key: string]: number | undefined }
  totalExamples: number
  smoothing: number

  constructor (smoothing?: number)
  getClassifications (observation: ApparatusObservation): ApparatusClassification[]
  probabilityOfClass (observation: ApparatusObservation, label: string): number
  static restore (classifier: string | ApparatusBayesClassifier): ApparatusBayesClassifier
}

// TODO: Not needed for natural repository, but could be moved to
// aparatus repository. Temporarily leaving here for copypasta.
declare class ApparatusLogisticRegressionClassifier extends ApparatusClassifier {
  examples: { [key: string]: number[] | undefined }
  // TODO: These appear used
  // features: any[]
  // featurePositions: { [key: string]: any | undefined }
  maxFeaturePosition: number
  classifications: string[]
  exampleCount: number

  createClassifications (): number[][]
  addExample (data: number[], classification: string): void
  getClassifications (observation: number[]): ApparatusClassification[]
  static restore (classifier: string | ApparatusLogisticRegressionClassifier): ApparatusLogisticRegressionClassifier
}

// End apparatus declarations

export interface ClassifierDoc {
  label: string
  text: string
}

export interface ClassifierOptions {
  keepStops?: boolean
}

export type ClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: ClassifierBase) => void

declare class ClassifierBase {
  classifier: ApparatusClassifier
  docs: ClassifierDoc[]
  features: { [key: string]: number | undefined }
  stemmer: Stemmer
  lastAdded: number
  events: events.EventEmitter

  constructor (classifier: ApparatusClassifier, stemmer?: Stemmer)
  addDocument (text: string | string[], classification: string): void
  removeDocument (text: string | string[], classification: string): void
  textToFeatures (observation: string | string[]): number[]
  train (): void
  retrain (): void
  getClassifications (observation: string | string[]): ApparatusClassification[]
  classify (observation: string | string[]): string
  setOptions (options: ClassifierOptions): void
  save (filename: string, callback: ClassifierCallback): void
}

export type BayesClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: BayesClassifier) => void

declare class BayesClassifier extends ClassifierBase {
  constructor (stemmer?: Stemmer, smoothing?: number)
  static load (filename: string, stemmer: Stemmer | null | undefined, callback: BayesClassifierCallback): void
  static restore (classifier: BayesClassifier, stemmer?: Stemmer): BayesClassifier
}

export type LogisticRegressionClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: LogisticRegressionClassifier) => void

declare class LogisticRegressionClassifier extends ClassifierBase {
  constructor (stemmer?: Stemmer)
  static load (filename: string, stemmer: Stemmer | null | undefined, callback: LogisticRegressionClassifierCallback): void
  static restore (classifier: LogisticRegressionClassifier, stemmer?: Stemmer): LogisticRegressionClassifier
}

export type MaxEntClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: MaxEntClassifier | null) => void

declare class MaxEntClassifier {
  sample: Sample
  features: FeatureSet

  constructor (features: FeatureSet, sample: Sample)
  addElement (x: Element): void
  addDocument (context: Context, classification: string, elementClass: Element): void
  train (maxIterations: number, minImprovement: number, unused: any): void
  getClassifications (b: Context): ApparatusClassification[]
  classify (b: Context): string
  // These are not static like in other Classifier classes
  save (filename: string, callback: MaxEntClassifierCallback): void
  load (filename: string, elementClass: Element, callback: MaxEntClassifierCallback): void
}

declare class Distribution {
  alpha: number[]
  featureSet: FeatureSet
  sample: Sample

  constructor (alpha: number[], featureSet: FeatureSet, sample: Sample)
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
  map: { [key: string]: boolean | undefined }

  addFeature (feature: Feature): boolean
  featureExists (feature: Feature): boolean
  getFeatures (): Feature[]
  size (): number
  prettyPrint (): string
}

export type SampleCallback = (err: NodeJS.ErrnoException | null, sample?: Sample | null) => void

declare class Sample {
  frequencyOfContext: { [key: string]: number | undefined }
  frequency: { [key: string]: number | undefined }
  classes: string[]

  constructor (elements?: Element[])
  analyse (): void
  addElement (x: Element): void
  observedProbabilityOfContext (context: Context): number
  observedProbability (x: Element): number
  size (): number
  getClasses (): string[]
  generateFeatures (featureSet: FeatureSet): void
  save (filename: string, callback: SampleCallback): void
  load (filename: string, elementClass: typeof Element, callback: SampleCallback): void
}

declare class Context {
  key: string | undefined;

  constructor (data: any)
  toString (): string
}

declare class Element {
  a: string
  b: Context
  key: string | undefined

  constructor (a: string, b: Context)
  toString (): string
}

declare class SEElement extends Element {
  constructor (a: string, b: Context)
  generateFeatures (featureSet: FeatureSet): void
}

declare class POSElement extends Element {
  constructor (a: string, b: Context)
  generateFeatures (featureSet: FeatureSet): void
}

declare class GISScaler {
  constructor (featureSet: FeatureSet, sample: Sample)
  calculateMaxSumOfFeatures (): boolean
  addCorrectionFeature (): void
  run (maxIterations: number, minImprovement: number): Distribution
}

declare class MESentence {
  constructor (data?: string[])
  generateSampleElements (sample: Sample): void
}

declare class MECorpus {
  constructor (data: string | Corpus, BROWN: number, SentenceClass: typeof Sentence)
  generateSample (): Sample
  splitInTrainAndTest (percentageTrain: number): [MECorpus, MECorpus]
}
