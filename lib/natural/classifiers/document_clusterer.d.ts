/*
Copyright (c) 2011, Chris Umbel

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

import type { TfIdf } from '../tfidf'
import type { KMeansOptions } from './kmeans'

export interface DocumentClustererOptions {
  kmeans?: KMeansOptions
  tfidf?: TfIdf | Record<string, unknown>
  minTermFrequency?: number
  maxFeatures?: number | null
}

export interface ClusteredDocument {
  index: number
  text: string | string[]
  key: any
  vector: number[]
}

export interface ClusterTerm {
  term: string
  score: number
}

export interface ClusteringStatistics {
  numClusters: number
  numDocuments: number
  vocabularySize: number
  iterations: number
  clusterSizes: number[]
  averageClusterSize: number
}

export class DocumentClusterer {
  k: number
  options: DocumentClustererOptions
  tfidf: TfIdf
  documents: Array<{ text: string | string[], key: any }>
  vocabulary: string[] | null
  documentVectors: number[][] | null
  clusterAssignments: number[] | null

  constructor (k: number, options?: DocumentClustererOptions)

  addDocument (document: string | string[], key?: any): void
  cluster (kmeansOptions?: KMeansOptions | null): DocumentClusterer
  getClusterAssignments (): number[]
  getClusters (): ClusteredDocument[][]
  getClusterTerms (topN?: number): ClusterTerm[][]
  predict (document: string | string[]): number
  getStatistics (): ClusteringStatistics
  toJSON (): Record<string, unknown>
  
  static fromJSON (json: Record<string, unknown>): DocumentClusterer
}
