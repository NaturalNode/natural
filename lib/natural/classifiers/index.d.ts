import events from 'events'
import type { Corpus, Sentence } from '../brill_pos_tagger'
import type { Stemmer } from '../stemmers'
import type { StorageBackend } from '../util'

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

declare interface ApparatusClassification {
  label: string
  value: number
}

// Observations are either array of numbers or a sparse vector in the form of a map
declare type ApparatusObservation = number[] | Record<string, number | string | boolean>

declare class ApparatusClassifier {
  addExample (observation: ApparatusObservation, label: string): void
  classify (observation: ApparatusObservation): string
  train (): void
  static restore (classifier: string | ApparatusClassifier): ApparatusClassifier
}

// TODO: Not needed for natural repository, but could be moved to
// aparatus repository. Temporarily leaving here for copypasta.
declare class ApparatusBayesClassifier extends ApparatusClassifier {
  classFeatures: Record<string, Record<number, number>>
  classTotals: Record<string, number>
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
  examples: Record<string, ApparatusObservation>
  // TODO: These appear unused
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

declare interface ClassifierDoc {
  label: string
  text: string
}

declare interface ClassifierOptions {
  keepStops?: boolean
}

declare type ClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: ClassifierBase) => void
declare type ParallelTrainerCallback = (err: NodeJS.ErrnoException | null) => void

declare class ClassifierBase extends events.EventEmitter {
  classifier: ApparatusClassifier
  docs: ClassifierDoc[]
  features: Record<string, number>
  stemmer: Stemmer
  lastAdded: number

  constructor (classifier: ApparatusClassifier, stemmer?: Stemmer)
  addDocument (text: string | string[], classification: string): void
  removeDocument (text: string | string[], classification: string): void
  textToFeatures (observation: string | string[]): number[]
  train (): void
  retrain (): void
  getClassifications (observation: string | string[]): ApparatusClassification[]
  classify (observation: string | string[]): string
  setOptions (options: ClassifierOptions): void
  save (filename: string, callback?: ClassifierCallback): void
  static load (filename: string, stemmer: Stemmer | null | undefined, callback: ClassifierCallback): void
  saveTo (storage: StorageBackend): string
  static loadFrom (storage: StorageBackend): ClassifierBase

  Threads: any
  trainParallel (numThreads: number, callback: ParallelTrainerCallback): void
  trainParallelBatches (options: { numThreads: number, batchSize: number }): void
  retrainParallel (numThreads: number, callback: ParallelTrainerCallback): void
}

declare type BayesClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: BayesClassifier) => void

export class BayesClassifier extends ClassifierBase {
  classifier: ApparatusBayesClassifier

  constructor (stemmer?: Stemmer, smoothing?: number)
  static load (filename: string, stemmer: Stemmer | null | undefined, callback: BayesClassifierCallback): void
  static restore (classifier: Record<string, unknown>, stemmer?: Stemmer): BayesClassifier
  saveTo (storage: StorageBackend): string
  static loadFrom (storage: StorageBackend): ClassifierBase
}

declare type LogisticRegressionClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: LogisticRegressionClassifier) => void

export class LogisticRegressionClassifier extends ClassifierBase {
  constructor (stemmer?: Stemmer)
  static load (filename: string, stemmer: Stemmer | null | undefined, callback: LogisticRegressionClassifierCallback): void
  static restore (classifier: Record<string, unknown>, stemmer?: Stemmer): LogisticRegressionClassifier
  saveTo (storage: StorageBackend): string
  static loadFrom (storage: StorageBackend): ClassifierBase
}

declare type MaxEntClassifierCallback = (err: NodeJS.ErrnoException | null, classifier?: MaxEntClassifier) => void

export class MaxEntClassifier {
  sample: Sample
  features: FeatureSet
  scaler: GISScaler

  constructor (features: FeatureSet, sample: Sample)
  addElement (x: Element): void
  addDocument (context: Context, classification: string, elementClass: Element): void
  train (maxIterations: number, minImprovement: number): void
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

declare type FeatureFunction = (x: Element) => number

export class Feature {
  evaluate: FeatureFunction
  name: string
  parameters: string[]

  constructor (f: FeatureFunction, name: string, parameters: string[])
  apply (x: Element): number
  expectationApprox (p: Distribution, sample: Sample): number
  expectation (p: Distribution, A: string[], B: Context[]): number
  observedExpectation (sample: Sample): number
}

export class FeatureSet {
  features: Feature[]
  map: Record<string, boolean>

  addFeature (feature: Feature): boolean
  featureExists (feature: Feature): boolean
  getFeatures (): Feature[]
  size (): number
  prettyPrint (): string
}

declare type SampleCallback = (err: NodeJS.ErrnoException | null, sample?: Sample | null) => void

export class Sample {
  frequencyOfContext: Record<string, number>
  frequency: Record<string, number>
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

export class Context {
  key: string | undefined

  constructor (data: any)
  toString (): string
}

export class Element {
  a: string
  b: Context
  key: string | undefined

  constructor (a: string, b: Context)
  toString (): string
}

export class SEElement extends Element {
  constructor (a: string, b: Context)
  generateFeatures (featureSet: FeatureSet): void
}

export class POSElement extends Element {
  constructor (a: string, b: Context)
  generateFeatures (featureSet: FeatureSet): void
}

export class GISScaler {
  iteration: number
  improvement: number

  constructor (featureSet: FeatureSet, sample: Sample)
  calculateMaxSumOfFeatures (): boolean
  addCorrectionFeature (): void
  run (maxIterations: number, minImprovement: number): Distribution
}

export class MESentence {
  constructor (data?: string[])
  generateSampleElements (sample: Sample): void
}

export class MECorpus {
  constructor (data: string | Corpus, BROWN: number, SentenceClass: typeof Sentence)
  generateSample (): Sample
  splitInTrainAndTest (percentageTrain: number): [MECorpus, MECorpus]
}
