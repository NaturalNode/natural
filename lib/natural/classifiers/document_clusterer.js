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

'use strict'

const TfIdf = require('../tfidf/tfidf')
const KMeans = require('./kmeans')

/**
 * Document Clusterer using TF-IDF vectorization and K-Means clustering
 */
class DocumentClusterer {
  /**
   * @param {number} k - Number of clusters
   * @param {Object} options - Configuration options
   * @param {Object} options.kmeans - KMeans configuration (maxIterations, tolerance, initialization)
   * @param {Object} options.tfidf - TfIdf instance or configuration
   * @param {number} options.minTermFrequency - Minimum term frequency for feature selection (default: 0)
   * @param {number} options.maxFeatures - Maximum number of features to use (default: null, uses all)
   */
  constructor (k, options = {}) {
    this.k = k
    this.options = options
    this.tfidf = options.tfidf instanceof TfIdf ? options.tfidf : new TfIdf(options.tfidf)
    this.kmeans = null
    this.documents = []
    this.vocabulary = null
    this.minTermFrequency = options.minTermFrequency || 0
    this.maxFeatures = options.maxFeatures || null
    this.documentVectors = null
    this.clusterAssignments = null
  }

  /**
   * Add a document to the clusterer
   * @param {string|Array<string>} document - Document text or token array
   * @param {*} key - Optional document key/identifier
   */
  addDocument (document, key) {
    this.documents.push({ text: document, key })
    this.tfidf.addDocument(document, key)
    // Reset clustering when new documents are added
    this.kmeans = null
    this.vocabulary = null
    this.documentVectors = null
    this.clusterAssignments = null
  }

  /**
   * Build vocabulary from all documents
   * @private
   */
  buildVocabulary () {
    const termFrequencies = {}
    const termIdfs = {}

    // Collect all terms and their document frequencies, and calculate IDF
    for (let docIndex = 0; docIndex < this.tfidf.documents.length; docIndex++) {
      const terms = this.tfidf.listTerms(docIndex)
      for (const termInfo of terms) {
        if (!termFrequencies[termInfo.term]) {
          termFrequencies[termInfo.term] = 0
          // Calculate IDF for this term (only once)
          termIdfs[termInfo.term] = termInfo.idf
        }
        termFrequencies[termInfo.term]++
      }
    }

    // Filter by minimum term frequency
    let vocabulary = Object.keys(termFrequencies).filter(term =>
      termFrequencies[term] >= this.minTermFrequency
    )

    // Sort by IDF (descending) - prioritize distinctive terms
    vocabulary.sort((a, b) => termIdfs[b] - termIdfs[a])

    // Limit to max features if specified
    if (this.maxFeatures && vocabulary.length > this.maxFeatures) {
      vocabulary = vocabulary.slice(0, this.maxFeatures)
    }

    this.vocabulary = vocabulary
    return vocabulary
  }

  /**
   * Convert documents to TF-IDF vectors
   * @private
   */
  vectorizeDocuments () {
    if (!this.vocabulary) {
      this.buildVocabulary()
    }

    const vectors = []

    for (let docIndex = 0; docIndex < this.tfidf.documents.length; docIndex++) {
      const vector = new Array(this.vocabulary.length).fill(0)

      for (let termIndex = 0; termIndex < this.vocabulary.length; termIndex++) {
        const term = this.vocabulary[termIndex]
        vector[termIndex] = this.tfidf.tfidf(term, docIndex)
      }

      // L2 normalization: divide by the magnitude of the vector
      // This is important for K-means to work well with TF-IDF vectors
      let magnitude = 0
      for (let i = 0; i < vector.length; i++) {
        magnitude += vector[i] * vector[i]
      }
      magnitude = Math.sqrt(magnitude)

      if (magnitude > 0) {
        for (let i = 0; i < vector.length; i++) {
          vector[i] /= magnitude
        }
      }

      vectors.push(vector)
    }

    this.documentVectors = vectors
    return vectors
  }

  /**
   * Perform clustering on the documents
   * @param {Object} kmeansOptions - Optional KMeans configuration to override constructor options
   * @returns {DocumentClusterer} - Returns this for chaining
   */
  cluster (kmeansOptions = null) {
    if (this.documents.length === 0) {
      throw new Error('No documents to cluster')
    }

    if (this.documents.length < this.k) {
      throw new Error(`Number of documents (${this.documents.length}) must be >= k (${this.k})`)
    }

    // Vectorize documents
    const vectors = this.vectorizeDocuments()

    // Configure and run KMeans
    const options = kmeansOptions || this.options.kmeans || {}
    this.kmeans = new KMeans(this.k, options)
    this.kmeans.fit(vectors)

    this.clusterAssignments = this.kmeans.getAssignments()

    return this
  }

  /**
   * Get cluster assignment for each document
   * @returns {Array<number>} - Array of cluster indices
   */
  getClusterAssignments () {
    if (!this.clusterAssignments) {
      throw new Error('Documents must be clustered first. Call cluster() method.')
    }
    return this.clusterAssignments
  }

  /**
   * Get documents grouped by cluster
   * @returns {Array<Array<Object>>} - Array of clusters, each containing document objects
   */
  getClusters () {
    if (!this.kmeans) {
      throw new Error('Documents must be clustered first. Call cluster() method.')
    }

    const clusters = Array.from({ length: this.k }, () => [])
    const clusterIndices = this.kmeans.getClusters()

    for (let clusterIndex = 0; clusterIndex < this.k; clusterIndex++) {
      for (const docIndex of clusterIndices[clusterIndex]) {
        clusters[clusterIndex].push({
          index: docIndex,
          text: this.documents[docIndex].text,
          key: this.documents[docIndex].key,
          vector: this.documentVectors[docIndex]
        })
      }
    }

    return clusters
  }

  /**
   * Get the most representative terms for each cluster
   * @param {number} topN - Number of top terms to return per cluster (default: 10)
   * @returns {Array<Array<Object>>} - Array of clusters with top terms
   */
  getClusterTerms (topN = 10) {
    if (!this.kmeans) {
      throw new Error('Documents must be clustered first. Call cluster() method.')
    }

    const clusters = this.getClusters()
    const clusterTerms = []

    for (let clusterIndex = 0; clusterIndex < this.k; clusterIndex++) {
      const cluster = clusters[clusterIndex]

      if (cluster.length === 0) {
        clusterTerms.push([])
        continue
      }

      // Calculate mean TF-IDF for each term across documents in the cluster
      const termScores = {}

      for (const doc of cluster) {
        for (let termIndex = 0; termIndex < this.vocabulary.length; termIndex++) {
          const term = this.vocabulary[termIndex]
          const score = doc.vector[termIndex]

          if (!termScores[term]) {
            termScores[term] = 0
          }
          termScores[term] += score
        }
      }

      // Average the scores
      for (const term in termScores) {
        termScores[term] /= cluster.length
      }

      // Sort by score and take top N
      const topTerms = Object.entries(termScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([term, score]) => ({ term, score }))

      clusterTerms.push(topTerms)
    }

    return clusterTerms
  }

  /**
   * Predict cluster for a new document
   * @param {string|Array<string>} document - Document text or token array
   * @returns {number} - Cluster index
   */
  predict (document) {
    if (!this.kmeans) {
      throw new Error('Documents must be clustered first. Call cluster() method.')
    }

    // Create temporary TfIdf with same vocabulary
    const tempTfidf = new TfIdf()
    // Add existing documents to maintain IDF values
    for (const doc of this.documents) {
      tempTfidf.addDocument(doc.text, doc.key)
    }
    // Add the new document
    tempTfidf.addDocument(document)

    // Vectorize the new document
    const vector = new Array(this.vocabulary.length).fill(0)
    const newDocIndex = tempTfidf.documents.length - 1

    for (let termIndex = 0; termIndex < this.vocabulary.length; termIndex++) {
      const term = this.vocabulary[termIndex]
      vector[termIndex] = tempTfidf.tfidf(term, newDocIndex)
    }

    // L2 normalization (same as training vectors)
    let magnitude = 0
    for (let i = 0; i < vector.length; i++) {
      magnitude += vector[i] * vector[i]
    }
    magnitude = Math.sqrt(magnitude)

    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= magnitude
      }
    }

    // Predict using KMeans
    const prediction = this.kmeans.predict([vector])
    return prediction[0]
  }

  /**
   * Get summary statistics for the clustering
   * @returns {Object} - Clustering statistics
   */
  getStatistics () {
    if (!this.kmeans) {
      throw new Error('Documents must be clustered first. Call cluster() method.')
    }

    const clusters = this.getClusters()
    const stats = {
      numClusters: this.k,
      numDocuments: this.documents.length,
      vocabularySize: this.vocabulary.length,
      iterations: this.kmeans.iterations,
      clusterSizes: clusters.map(c => c.length),
      averageClusterSize: this.documents.length / this.k
    }

    return stats
  }

  /**
   * Serialize the clusterer state
   * @returns {Object} - Serialized state
   */
  toJSON () {
    return {
      k: this.k,
      options: this.options,
      documents: this.documents,
      vocabulary: this.vocabulary,
      documentVectors: this.documentVectors,
      clusterAssignments: this.clusterAssignments,
      tfidf: {
        documents: this.tfidf.documents,
        _idfCache: this.tfidf._idfCache
      },
      kmeans: this.kmeans ? {
        centroids: this.kmeans.centroids,
        iterations: this.kmeans.iterations
      } : null
    }
  }

  /**
   * Restore a clusterer from serialized state
   * @param {Object} json - Serialized state
   * @returns {DocumentClusterer} - Restored clusterer instance
   */
  static fromJSON (json) {
    const clusterer = new DocumentClusterer(json.k, json.options)
    clusterer.documents = json.documents
    clusterer.vocabulary = json.vocabulary
    clusterer.documentVectors = json.documentVectors
    clusterer.clusterAssignments = json.clusterAssignments

    // Restore TfIdf
    clusterer.tfidf = new TfIdf(json.tfidf)

    // Restore KMeans if it was fitted
    if (json.kmeans) {
      clusterer.kmeans = new KMeans(json.k, json.options.kmeans || {})
      clusterer.kmeans.centroids = json.kmeans.centroids
      clusterer.kmeans.iterations = json.kmeans.iterations
      clusterer.kmeans.assignments = json.clusterAssignments
      clusterer.kmeans.clusters = Array.from({ length: json.k }, () => [])
      for (let i = 0; i < json.clusterAssignments.length; i++) {
        clusterer.kmeans.clusters[json.clusterAssignments[i]].push(i)
      }
    }

    return clusterer
  }
}

module.exports = DocumentClusterer
