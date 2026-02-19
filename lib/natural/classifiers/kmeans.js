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

/**
 * Calculate Euclidean distance between two vectors
 */
function euclideanDistance (a, b) {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i]
    sum += diff * diff
  }
  return Math.sqrt(sum)
}

/**
 * Calculate the mean of vectors
 */
function calculateMean (vectors) {
  if (vectors.length === 0) return null

  const dimensions = vectors[0].length
  const mean = new Array(dimensions).fill(0)

  for (let i = 0; i < vectors.length; i++) {
    for (let j = 0; j < dimensions; j++) {
      mean[j] += vectors[i][j]
    }
  }

  for (let j = 0; j < dimensions; j++) {
    mean[j] /= vectors.length
  }

  return mean
}

/**
 * K-Means clustering algorithm
 */
class KMeans {
  /**
   * @param {number} k - Number of clusters
   * @param {Object} options - Configuration options
   * @param {number} options.maxIterations - Maximum number of iterations (default: 100)
   * @param {number} options.tolerance - Convergence tolerance (default: 0.0001)
   * @param {string} options.initialization - Initialization method: 'random' or 'kmeans++' (default: 'kmeans++')
   */
  constructor (k, options = {}) {
    this.k = k
    this.maxIterations = options.maxIterations || 100
    this.tolerance = options.tolerance || 0.0001
    this.initialization = options.initialization || 'kmeans++'
    this.centroids = null
    this.clusters = null
    this.iterations = 0
  }

  /**
   * Initialize centroids using random selection
   */
  initializeRandomCentroids (data) {
    const centroids = []
    const indices = new Set()

    while (indices.size < this.k) {
      const randomIndex = Math.floor(Math.random() * data.length)
      if (!indices.has(randomIndex)) {
        indices.add(randomIndex)
        centroids.push([...data[randomIndex]])
      }
    }

    return centroids
  }

  /**
   * Initialize centroids using k-means++ algorithm
   * This tends to find better initial centroids than random selection
   */
  initializeKMeansPlusPlusCentroids (data) {
    const centroids = []

    // Choose first centroid randomly
    const firstIndex = Math.floor(Math.random() * data.length)
    centroids.push([...data[firstIndex]])

    // Choose remaining centroids
    for (let i = 1; i < this.k; i++) {
      const distances = data.map(point => {
        // Find minimum distance to existing centroids
        let minDist = Infinity
        for (const centroid of centroids) {
          const dist = euclideanDistance(point, centroid)
          if (dist < minDist) {
            minDist = dist
          }
        }
        return minDist * minDist // Square the distance for probability weighting
      })

      // Calculate total distance
      const totalDist = distances.reduce((sum, d) => sum + d, 0)

      // Choose next centroid with probability proportional to distance squared
      let random = Math.random() * totalDist
      let selectedIndex = 0

      for (let j = 0; j < distances.length; j++) {
        random -= distances[j]
        if (random <= 0) {
          selectedIndex = j
          break
        }
      }

      centroids.push([...data[selectedIndex]])
    }

    return centroids
  }

  /**
   * Assign each data point to the nearest centroid
   */
  assignPointsToClusters (data) {
    const clusters = Array.from({ length: this.k }, () => [])
    const assignments = new Array(data.length)

    for (let i = 0; i < data.length; i++) {
      let minDistance = Infinity
      let clusterIndex = 0

      for (let j = 0; j < this.k; j++) {
        const distance = euclideanDistance(data[i], this.centroids[j])
        if (distance < minDistance) {
          minDistance = distance
          clusterIndex = j
        }
      }

      clusters[clusterIndex].push(i)
      assignments[i] = clusterIndex
    }

    return { clusters, assignments }
  }

  /**
   * Update centroids based on the mean of points in each cluster
   */
  updateCentroids (data, clusters) {
    const newCentroids = []

    for (let i = 0; i < this.k; i++) {
      if (clusters[i].length === 0) {
        // Keep old centroid if cluster is empty
        newCentroids.push([...this.centroids[i]])
      } else {
        const clusterPoints = clusters[i].map(idx => data[idx])
        newCentroids.push(calculateMean(clusterPoints))
      }
    }

    return newCentroids
  }

  /**
   * Check if centroids have converged
   */
  hasConverged (oldCentroids, newCentroids) {
    for (let i = 0; i < this.k; i++) {
      const distance = euclideanDistance(oldCentroids[i], newCentroids[i])
      if (distance > this.tolerance) {
        return false
      }
    }
    return true
  }

  /**
   * Fit the model to the data
   * @param {Array<Array<number>>} data - Array of data points (vectors)
   * @returns {KMeans} - Returns this for chaining
   */
  fit (data) {
    if (!data || data.length === 0) {
      throw new Error('Data cannot be empty')
    }

    if (data.length < this.k) {
      throw new Error(`Number of data points (${data.length}) must be >= k (${this.k})`)
    }

    // Initialize centroids
    if (this.initialization === 'kmeans++') {
      this.centroids = this.initializeKMeansPlusPlusCentroids(data)
    } else {
      this.centroids = this.initializeRandomCentroids(data)
    }

    // Iterate until convergence or max iterations
    for (let iter = 0; iter < this.maxIterations; iter++) {
      this.iterations = iter + 1

      // Assign points to clusters
      const { clusters, assignments } = this.assignPointsToClusters(data)
      this.clusters = clusters
      this.assignments = assignments

      // Update centroids
      const newCentroids = this.updateCentroids(data, clusters)

      // Check for convergence
      if (this.hasConverged(this.centroids, newCentroids)) {
        this.centroids = newCentroids
        break
      }

      this.centroids = newCentroids
    }

    return this
  }

  /**
   * Predict cluster assignments for new data points
   * @param {Array<Array<number>>} data - Array of data points
   * @returns {Array<number>} - Array of cluster indices
   */
  predict (data) {
    if (!this.centroids) {
      throw new Error('Model must be fitted before prediction')
    }

    if (!Array.isArray(data[0])) {
      // Single data point
      data = [data]
    }

    const predictions = []
    for (const point of data) {
      let minDistance = Infinity
      let clusterIndex = 0

      for (let j = 0; j < this.k; j++) {
        const distance = euclideanDistance(point, this.centroids[j])
        if (distance < minDistance) {
          minDistance = distance
          clusterIndex = j
        }
      }

      predictions.push(clusterIndex)
    }

    return predictions
  }

  /**
   * Get the centroids
   * @returns {Array<Array<number>>} - Cluster centroids
   */
  getCentroids () {
    return this.centroids
  }

  /**
   * Get cluster assignments for the training data
   * @returns {Array<number>} - Array of cluster indices
   */
  getAssignments () {
    return this.assignments
  }

  /**
   * Get clusters (indices of points in each cluster)
   * @returns {Array<Array<number>>} - Array of clusters
   */
  getClusters () {
    return this.clusters
  }
}

module.exports = KMeans
