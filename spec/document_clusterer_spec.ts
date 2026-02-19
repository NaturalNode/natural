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

import { DocumentClusterer } from 'lib/natural'

describe('DocumentClusterer', function () {
  describe('basic document clustering', function () {
    it('should cluster similar documents together', function () {
      const clusterer = new DocumentClusterer(2)

      // Add documents about two different topics with distinct vocabularies
      clusterer.addDocument('feline kitten meow purr whiskers cat kitty')
      clusterer.addDocument('canine puppy bark woof tail dog doggy')
      clusterer.addDocument('feline cat meow purr kitty whiskers kitten')
      clusterer.addDocument('canine dog bark woof doggy tail puppy')

      clusterer.cluster()

      const assignments = clusterer.getClusterAssignments()
      expect(assignments.length).toBe(4)

      // Documents 0 and 2 are about cats (feline-related), should be in same cluster
      // Documents 1 and 3 are about dogs (canine-related), should be in same cluster
      expect(assignments[0]).toBe(assignments[2])
      expect(assignments[1]).toBe(assignments[3])
    })

    it('should handle document keys', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('Technology is advancing rapidly', 'tech1')
      clusterer.addDocument('Machine learning is a subset of AI', 'tech2')
      clusterer.addDocument('The recipe requires flour and sugar', 'food1')
      clusterer.addDocument('Baking is a popular hobby', 'food2')

      clusterer.cluster()

      const clusters = clusterer.getClusters()
      expect(clusters.length).toBe(2)

      // Verify keys are preserved
      const allKeys = clusters.flatMap(cluster => 
        cluster.map(doc => doc.key)
      )
      expect(allKeys).toContain('tech1')
      expect(allKeys).toContain('food1')
    })

    it('should cluster with different k values', function () {
      const clusterer = new DocumentClusterer(3)

      clusterer.addDocument('Sports game was exciting')
      clusterer.addDocument('Football match ended in victory')
      clusterer.addDocument('Python is a programming language')
      clusterer.addDocument('JavaScript is used for web development')
      clusterer.addDocument('The restaurant serves delicious food')
      clusterer.addDocument('The chef prepared a gourmet meal')

      clusterer.cluster()

      const clusters = clusterer.getClusters()
      expect(clusters.length).toBe(3)
    })
  })

  describe('prediction', function () {
    it('should predict cluster for new documents', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('The cat meowed loudly')
      clusterer.addDocument('Cats enjoy playing with toys')
      clusterer.addDocument('Dogs bark at strangers')
      clusterer.addDocument('The dog wagged its tail')

      clusterer.cluster()

      // Predict cluster for a new cat-related document
      const catCluster = clusterer.predict('The kitten is very cute')
      
      // Predict cluster for a new dog-related document
      const dogCluster = clusterer.predict('The puppy is energetic')

      expect(typeof catCluster).toBe('number')
      expect(typeof dogCluster).toBe('number')
      expect(catCluster).toBeGreaterThanOrEqual(0)
      expect(catCluster).toBeLessThan(2)
    })
  })

  describe('cluster terms', function () {
    it('should return top terms for each cluster', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('machine learning models predict patterns')
      clusterer.addDocument('artificial intelligence algorithms improve accuracy')
      clusterer.addDocument('pizza pasta italian restaurant food')
      clusterer.addDocument('cooking recipes ingredients kitchen meals')

      clusterer.cluster()

      const clusterTerms = clusterer.getClusterTerms(3)
      
      expect(clusterTerms.length).toBe(2)
      expect(clusterTerms[0].length).toBeGreaterThan(0)
      expect(clusterTerms[0].length).toBeLessThanOrEqual(3)
      
      // Each term should have term and score properties
      expect(clusterTerms[0][0].term).toBeDefined()
      expect(clusterTerms[0][0].score).toBeDefined()
      expect(typeof clusterTerms[0][0].term).toBe('string')
      expect(typeof clusterTerms[0][0].score).toBe('number')
    })

    it('should return specified number of top terms', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('word1 word2 word3 word4 word5')
      clusterer.addDocument('word1 word2 word3 word4 word6')
      clusterer.addDocument('word10 word11 word12 word13 word14')
      clusterer.addDocument('word10 word11 word12 word13 word15')

      clusterer.cluster()

      const clusterTerms5 = clusterer.getClusterTerms(5)
      const clusterTerms3 = clusterer.getClusterTerms(3)

      expect(clusterTerms5[0].length).toBeLessThanOrEqual(5)
      expect(clusterTerms3[0].length).toBeLessThanOrEqual(3)
    })
  })

  describe('statistics', function () {
    it('should return clustering statistics', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('document one')
      clusterer.addDocument('document two')
      clusterer.addDocument('document three')
      clusterer.addDocument('document four')

      clusterer.cluster()

      const stats = clusterer.getStatistics()

      expect(stats.numClusters).toBe(2)
      expect(stats.numDocuments).toBe(4)
      expect(stats.vocabularySize).toBeGreaterThan(0)
      expect(stats.iterations).toBeGreaterThan(0)
      expect(stats.clusterSizes.length).toBe(2)
      expect(stats.averageClusterSize).toBe(2)
    })
  })

  describe('serialization', function () {
    it('should serialize and deserialize correctly', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('first document', 'doc1')
      clusterer.addDocument('second document', 'doc2')
      clusterer.addDocument('third document', 'doc3')
      clusterer.addDocument('fourth document', 'doc4')

      clusterer.cluster()

      const originalAssignments = clusterer.getClusterAssignments()
      const originalStats = clusterer.getStatistics()

      // Serialize
      const json = clusterer.toJSON()
      
      // Deserialize
      const restored = DocumentClusterer.fromJSON(json)

      const restoredAssignments = restored.getClusterAssignments()
      const restoredStats = restored.getStatistics()

      // Verify assignments are preserved
      expect(restoredAssignments).toEqual(originalAssignments)
      
      // Verify statistics are preserved
      expect(restoredStats.numClusters).toBe(originalStats.numClusters)
      expect(restoredStats.numDocuments).toBe(originalStats.numDocuments)
      expect(restoredStats.vocabularySize).toBe(originalStats.vocabularySize)
    })

    it('should allow prediction after deserialization', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('cat meow purr')
      clusterer.addDocument('kitten feline whiskers')
      clusterer.addDocument('dog bark woof')
      clusterer.addDocument('puppy canine tail')

      clusterer.cluster()

      const originalPrediction = clusterer.predict('the cat climbed a tree')

      // Serialize and deserialize
      const json = clusterer.toJSON()
      const restored = DocumentClusterer.fromJSON(json)

      const restoredPrediction = restored.predict('the cat climbed a tree')

      expect(restoredPrediction).toBe(originalPrediction)
    })
  })

  describe('options', function () {
    it('should respect minTermFrequency option', function () {
      const clusterer = new DocumentClusterer(2, {
        minTermFrequency: 2
      })

      clusterer.addDocument('common word rare1 rare2')
      clusterer.addDocument('common word rare3 rare4')
      clusterer.addDocument('common word rare5 rare6')
      clusterer.addDocument('common word rare7 rare8')

      clusterer.cluster()

      const stats = clusterer.getStatistics()
      
      // With minTermFrequency=2, only 'common' and 'word' should be in vocabulary
      expect(stats.vocabularySize).toBeLessThanOrEqual(2)
    })

    it('should respect maxFeatures option', function () {
      const clusterer = new DocumentClusterer(2, {
        maxFeatures: 3
      })

      clusterer.addDocument('word1 word2 word3 word4 word5')
      clusterer.addDocument('word1 word2 word3 word4 word5')
      clusterer.addDocument('word6 word7 word8 word9 word10')
      clusterer.addDocument('word6 word7 word8 word9 word10')

      clusterer.cluster()

      const stats = clusterer.getStatistics()
      
      // Vocabulary should be limited to 3 features
      expect(stats.vocabularySize).toBeLessThanOrEqual(3)
    })

    it('should accept kmeans options', function () {
      const clusterer = new DocumentClusterer(2, {
        kmeans: {
          maxIterations: 50,
          initialization: 'random'
        }
      })

      clusterer.addDocument('document one')
      clusterer.addDocument('document two')
      clusterer.addDocument('document three')
      clusterer.addDocument('document four')

      clusterer.cluster()

      const stats = clusterer.getStatistics()
      expect(stats.iterations).toBeLessThanOrEqual(50)
    })
  })

  describe('error handling', function () {
    it('should throw error when clustering with no documents', function () {
      const clusterer = new DocumentClusterer(2)
      
      expect(() => clusterer.cluster()).toThrowError('No documents to cluster')
    })

    it('should throw error when k > number of documents', function () {
      const clusterer = new DocumentClusterer(5)
      
      clusterer.addDocument('document one')
      clusterer.addDocument('document two')

      expect(() => clusterer.cluster()).toThrowError(/must be >= k/)
    })

    it('should throw error when getting clusters before clustering', function () {
      const clusterer = new DocumentClusterer(2)
      
      clusterer.addDocument('document one')
      clusterer.addDocument('document two')

      expect(() => clusterer.getClusterAssignments()).toThrowError('Documents must be clustered first. Call cluster() method.')
      expect(() => clusterer.getClusters()).toThrowError('Documents must be clustered first. Call cluster() method.')
      expect(() => clusterer.getClusterTerms()).toThrowError('Documents must be clustered first. Call cluster() method.')
    })

    it('should throw error when predicting before clustering', function () {
      const clusterer = new DocumentClusterer(2)
      
      clusterer.addDocument('document one')
      clusterer.addDocument('document two')

      expect(() => clusterer.predict('new document')).toThrowError('Documents must be clustered first. Call cluster() method.')
    })
  })

  describe('tokenized documents', function () {
    it('should handle pre-tokenized documents', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument(['machine', 'learning', 'model'])
      clusterer.addDocument(['artificial', 'intelligence', 'algorithm'])
      clusterer.addDocument(['pizza', 'pasta', 'italian'])
      clusterer.addDocument(['cooking', 'recipe', 'ingredients'])

      clusterer.cluster()

      const assignments = clusterer.getClusterAssignments()
      expect(assignments.length).toBe(4)
    })
  })

  describe('getClusters', function () {
    it('should return clusters with document information', function () {
      const clusterer = new DocumentClusterer(2)

      clusterer.addDocument('tech document one', 'tech1')
      clusterer.addDocument('tech document two', 'tech2')
      clusterer.addDocument('food document one', 'food1')
      clusterer.addDocument('food document two', 'food2')

      clusterer.cluster()

      const clusters = clusterer.getClusters()

      expect(clusters.length).toBe(2)
      
      // Each document should have required properties
      clusters.forEach(cluster => {
        cluster.forEach(doc => {
          expect(doc.index).toBeDefined()
          expect(doc.text).toBeDefined()
          expect(doc.key).toBeDefined()
          expect(doc.vector).toBeDefined()
          expect(Array.isArray(doc.vector)).toBe(true)
        })
      })
    })
  })
})
