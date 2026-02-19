/*
Example of using DocumentClusterer for document clustering with K-Means
*/

const natural = require('../../lib/natural')
const DocumentClusterer = natural.DocumentClusterer
const TfIdf = natural.TfIdf

// Sample documents about different topics
const documents = [
  // Sports documents - diverse sports vocabulary
  'The basketball game was exciting with a final score of 95-92. The team played excellent defense and scored many baskets.',
  'Soccer match ended in a 2-1 victory for the home team. The goalkeeper made several crucial saves to protect the goal.',
  'The football team scored three touchdowns in the final quarter. The offensive line blocked well for the running back.',
  'Tennis player won the championship in straight sets. The serve and volley game was impressive throughout.',
  'Baseball game went into extra innings. The batter hit a home run to win the game for the team.',
  'Hockey match was intense with many body checks. The goaltender made an amazing save in the final seconds.',

  // Technology documents - diverse tech vocabulary
  'JavaScript is a popular programming language for web development. The DOM API allows manipulating HTML elements dynamically.',
  'Python is widely used for machine learning and data science. Libraries like NumPy and Pandas enable data manipulation.',
  'The new software update includes bug fixes and performance improvements. The compiler optimizes code better than before.',
  'Cloud computing services are becoming more affordable. AWS and Azure provide scalable infrastructure solutions.',
  'Database management systems store structured data efficiently. SQL queries retrieve and filter information quickly.',
  'Mobile app development frameworks like React Native enable cross-platform coding. The UI components render smoothly.',

  // Food documents - diverse food vocabulary
  'The restaurant serves delicious Italian pasta and pizza with authentic sauce. The chef uses imported ingredients.',
  'Fresh vegetables and fruits are essential for a healthy diet. Organic produce tastes better and contains more nutrients.',
  'The chef prepared a gourmet meal with local ingredients sourced from farmers markets. The flavors were exquisite.',
  'Baking bread requires flour, water, yeast, and salt. The dough must rise for hours to develop flavor and texture.',
  'Cooking recipes require precise measurements of spices and seasonings. The flavor profile comes from the ingredient combinations.',
  'The bakery makes fresh croissants every morning. The pastry is flaky and buttery with a golden brown crust.'
]

console.log('Creating Document Clusterer with k=3 clusters...\n')

// Create a custom TfIdf instance with a more selective stopword list
// This keeps words that help distinguish between topics
const customStopwords = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'this', 'that', 'these', 'those',
  'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'what', 'which', 'who', 'when', 'where', 'why', 'how'
]

const tfidf = new TfIdf()
tfidf.setStopwords(customStopwords)

// Create clusterer with 3 clusters using custom TfIdf
// Note: vocabulary is sorted by IDF (Inverse Document Frequency) by default,
// so the most discriminative terms are used for clustering
const clusterer = new DocumentClusterer(3, {
  tfidf: tfidf,
  minTermFrequency: 1,  // Keep all terms that appear in at least 1 document
  kmeans: {
    maxIterations: 500,  // Allow more iterations for convergence
    tolerance: 0.00001,  // Stricter convergence criteria
    initialization: 'kmeans++' // Better initialization for better results
  }
})

// Add documents
console.log(`Adding ${documents.length} documents...`)
documents.forEach((doc, index) => {
  clusterer.addDocument(doc, `doc_${index}`)
})

// Perform clustering
console.log('Clustering documents...\n')
clusterer.cluster()

// Get statistics
const stats = clusterer.getStatistics()
console.log('Clustering Statistics:')
console.log('---------------------')
console.log(`Number of clusters: ${stats.numClusters}`)
console.log(`Number of documents: ${stats.numDocuments}`)
console.log(`Vocabulary size: ${stats.vocabularySize}`)
console.log(`Iterations: ${stats.iterations}`)
console.log(`Cluster sizes: ${stats.clusterSizes.join(', ')}`)
console.log()

// Show the vocabulary being used
console.log('Top 10 terms by IDF (used for clustering):')
console.log('------------------------------------------')
const vocabulary = clusterer.vocabulary
for (let i = 0; i < Math.min(10, vocabulary.length); i++) {
  const term = vocabulary[i]
  const idf = clusterer.tfidf.idf(term)
  console.log(`${i + 1}. "${term}": ${idf.toFixed(4)}`)
}
console.log()

// Get clusters with documents
const clusters = clusterer.getClusters()
console.log('Documents by Cluster:')
console.log('--------------------')
clusters.forEach((cluster, clusterIndex) => {
  console.log(`\nCluster ${clusterIndex} (${cluster.length} documents):`)
  cluster.forEach(doc => {
    console.log(`  - [${doc.key}]: ${doc.text.substring(0, 60)}...`)
  })
})

// Get top terms for each cluster
console.log('\n\nTop Terms by Cluster:')
console.log('--------------------')
const clusterTerms = clusterer.getClusterTerms(5)
clusterTerms.forEach((terms, clusterIndex) => {
  console.log(`\nCluster ${clusterIndex}:`)
  terms.forEach(({ term, score }) => {
    console.log(`  ${term}: ${score.toFixed(4)}`)
  })
})

// Predict cluster for new documents
console.log('\n\nPredicting clusters for new documents:')
console.log('--------------------------------------')
const newDocuments = [
  'The hockey team won the playoff game',
  'Machine learning algorithms improve over time',
  'The bakery makes fresh croissants every morning'
]

newDocuments.forEach(doc => {
  const cluster = clusterer.predict(doc)
  console.log(`\n"${doc}"`)
  console.log(`  -> Cluster ${cluster}`)
})

// Demonstrate serialization
console.log('\n\nSerialization Example:')
console.log('---------------------')
const serialized = JSON.stringify(clusterer.toJSON())
console.log(`Serialized size: ${serialized.length} characters`)

const restored = DocumentClusterer.fromJSON(JSON.parse(serialized))
console.log('Clusterer restored from JSON')

// Verify restoration
const restoredStats = restored.getStatistics()
console.log(`Restored clusters: ${restoredStats.numClusters}`)
console.log(`Restored documents: ${restoredStats.numDocuments}`)
