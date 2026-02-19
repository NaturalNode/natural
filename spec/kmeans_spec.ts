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

import { KMeans } from 'lib/natural'

describe('KMeans', function () {
  describe('basic clustering', function () {
    it('should cluster 2D points correctly', function () {
      const data = [
        [1, 1],
        [1.5, 2],
        [3, 4],
        [5, 7],
        [3.5, 5],
        [4.5, 5],
        [3.5, 4.5]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      const assignments = kmeans.getAssignments()
      expect(assignments.length).toBe(data.length)

      // Verify that similar points are in the same cluster
      expect(assignments[0]).toBe(assignments[1])
      expect(assignments[2]).toBe(assignments[3])
    })

    it('should handle single cluster', function () {
      const data = [
        [1, 2],
        [3, 4],
        [5, 6]
      ]

      const kmeans = new KMeans(1)
      kmeans.fit(data)

      const assignments = kmeans.getAssignments()
      expect(assignments).toEqual([0, 0, 0])
    })

    it('should handle 3 clusters', function () {
      const data = [
        [0, 0],
        [0.5, 0.5],
        [5, 5],
        [5.5, 5.5],
        [10, 10],
        [10.5, 10.5]
      ]

      const kmeans = new KMeans(3)
      kmeans.fit(data)

      const assignments = kmeans.getAssignments()
      
      // Points close together should be in same cluster
      expect(assignments[0]).toBe(assignments[1])
      expect(assignments[2]).toBe(assignments[3])
      expect(assignments[4]).toBe(assignments[5])

      // Distant points should be in different clusters
      expect(assignments[0]).not.toBe(assignments[2])
      expect(assignments[0]).not.toBe(assignments[4])
      expect(assignments[2]).not.toBe(assignments[4])
    })
  })

  describe('initialization methods', function () {
    it('should support random initialization', function () {
      const data = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ]

      const kmeans = new KMeans(2, { initialization: 'random' })
      kmeans.fit(data)

      expect(kmeans.getCentroids().length).toBe(2)
      expect(kmeans.getAssignments().length).toBe(4)
    })

    it('should support kmeans++ initialization', function () {
      const data = [
        [1, 1],
        [2, 2],
        [8, 8],
        [9, 9]
      ]

      const kmeans = new KMeans(2, { initialization: 'kmeans++' })
      kmeans.fit(data)

      expect(kmeans.getCentroids().length).toBe(2)
      expect(kmeans.getAssignments().length).toBe(4)
    })
  })

  describe('convergence', function () {
    it('should converge within max iterations', function () {
      const data = [
        [1, 1],
        [1.5, 2],
        [3, 4],
        [5, 7],
        [3.5, 5],
        [4.5, 5]
      ]

      const kmeans = new KMeans(2, { maxIterations: 100 })
      kmeans.fit(data)

      expect(kmeans.iterations).toBeLessThanOrEqual(100)
    })

    it('should respect tolerance parameter', function () {
      const data = [
        [0, 0],
        [0.1, 0.1],
        [10, 10],
        [10.1, 10.1]
      ]

      const kmeans = new KMeans(2, { tolerance: 0.001 })
      kmeans.fit(data)

      expect(kmeans.iterations).toBeGreaterThan(0)
    })
  })

  describe('prediction', function () {
    it('should predict cluster for new points', function () {
      const data = [
        [0, 0],
        [1, 1],
        [10, 10],
        [11, 11]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      // Predict cluster for points close to training data
      const predictions1 = kmeans.predict([[0.5, 0.5]])
      const predictions2 = kmeans.predict([[10.5, 10.5]])

      expect(predictions1[0]).toBe(kmeans.predict([[0, 0]])[0])
      expect(predictions2[0]).toBe(kmeans.predict([[10, 10]])[0])
      expect(predictions1[0]).not.toBe(predictions2[0])
    })

    it('should predict multiple points', function () {
      const data = [
        [0, 0],
        [1, 1],
        [10, 10],
        [11, 11]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      const predictions = kmeans.predict([
        [0.5, 0.5],
        [10.5, 10.5]
      ])

      expect(predictions.length).toBe(2)
      expect(predictions[0]).not.toBe(predictions[1])
    })
  })

  describe('error handling', function () {
    it('should throw error for empty data', function () {
      const kmeans = new KMeans(2)
      expect(() => kmeans.fit([])).toThrowError('Data cannot be empty')
    })

    it('should throw error when k > number of data points', function () {
      const data = [[1, 2], [3, 4]]
      const kmeans = new KMeans(3)
      
      expect(() => kmeans.fit(data)).toThrowError(/must be >= k/)
    })

    it('should throw error when predicting before fitting', function () {
      const kmeans = new KMeans(2)
      expect(() => kmeans.predict([[1, 2]])).toThrowError('Model must be fitted before prediction')
    })
  })

  describe('getter methods', function () {
    it('should return correct centroids', function () {
      const data = [
        [0, 0],
        [10, 10]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      const centroids = kmeans.getCentroids()
      expect(centroids.length).toBe(2)
      expect(centroids[0].length).toBe(2)
    })

    it('should return correct clusters', function () {
      const data = [
        [0, 0],
        [0.5, 0.5],
        [10, 10],
        [10.5, 10.5]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      const clusters = kmeans.getClusters()
      expect(clusters.length).toBe(2)
      
      // Each cluster should have 2 points
      const clusterSizes = clusters.map(c => c.length)
      expect(clusterSizes.sort()).toEqual([2, 2])
    })

    it('should return correct assignments', function () {
      const data = [
        [0, 0],
        [0.5, 0.5],
        [10, 10]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      const assignments = kmeans.getAssignments()
      expect(assignments.length).toBe(3)
      expect(assignments[0]).toBe(assignments[1])
    })
  })

  describe('higher dimensional data', function () {
    it('should cluster 3D points', function () {
      const data = [
        [1, 1, 1],
        [1.5, 1.5, 1.5],
        [10, 10, 10],
        [10.5, 10.5, 10.5]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      const assignments = kmeans.getAssignments()
      expect(assignments[0]).toBe(assignments[1])
      expect(assignments[2]).toBe(assignments[3])
      expect(assignments[0]).not.toBe(assignments[2])
    })

    it('should cluster high-dimensional points', function () {
      const data = [
        [1, 1, 1, 1, 1],
        [1.5, 1.5, 1.5, 1.5, 1.5],
        [10, 10, 10, 10, 10],
        [10.5, 10.5, 10.5, 10.5, 10.5]
      ]

      const kmeans = new KMeans(2)
      kmeans.fit(data)

      const assignments = kmeans.getAssignments()
      expect(assignments.length).toBe(4)
    })
  })
})
