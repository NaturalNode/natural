/*
Example of using DocumentClusterer for document clustering with K-Means
*/

const natural = require('../../lib/natural')
const DocumentClusterer = natural.DocumentClusterer
const TfIdf = natural.TfIdf

// Sample documents about different topics - with STRONG vocabulary differentiation
const documents = [
  // Sports documents - emphasize sports-specific terms
  'Basketball game with basketball player executing pick-and-roll. Offensive rebound and defensive rebound secured near the basket. Fast break down the court with basketball team working together. Point guard dribbles while forward cuts. Championship tournament with basketball referee and scoreboard tracking baskets. Dribbling technique critical for basketball success.',
  
  'Football match with football quarterback throwing football downfield. Football tackle by linebacker and safety. Football running back carries football into endzone scoring football touchdown. Football bench with football coach orchestrating football plays. Football stadium filled with football fans cheering rugby-style football game.',
  
  'Volleyball match with volleyball players on volleyball court. Volleyball spike and volleyball block executed by volleyball team. Volleyball serve using volleyball technique. Volleyball net separates volleyball opponent team. Volleyball tournament creates volleyball rallies. Volleyball championship with skilled volleyball athletes.',

  // Technology documents - emphasize tech-specific terms  
  'Python programming language used for algorithm development and data processing. Machine learning algorithms using artificial intelligence and neural networks. Python libraries like NumPy and TensorFlow for computational mathematics. Algorithm implementation requires Python coding and algorithmic thinking. Deep learning neural networks process data efficiently. Database integration for algorithm storage and retrieval.',
  
  'JavaScript and HTML programming for web application development. Web browser executes JavaScript code with Document Object Model API. Web development framework like React enables dynamic user interface. JavaScript function handling web events and web requests. Web server architecture with JavaScript backend and frontend development.',
  
  'Database management using SQL queries and database schema design. Database index optimization for database query performance. Database transaction and ACID properties ensuring database consistency. Database replication and database clustering for database availability. Database administrator configuring database security and database backup.',

  // Food documents - emphasize food-specific terms
  'Recipe ingredients including flour, sugar, butter, and eggs for baking. Baking recipe requires precise baking temperature and baking time. Baking techniques like kneading dough and baking at exact baking temperature. Bakery using baking oven and baking pans for baking bread. Baking results in delicious baked goods perfect for breakfast.',
  
  'Cooking technique involves cooking meat and cooking vegetables with cooking oil. Cook the ingredients using cooking method like roasting or boiling. Cooking recipe preparation requires cooking skills and cooking experience. Kitchen utensils assist cooking process and cooking preparation. Cooking creates flavorful meal enjoyed by cooking enthusiasts.',
  
  'Restaurant menu featuring fresh ingredients and gourmet recipes. Chef prepares cuisine using culinary technique and culinary ingredients. Restaurant kitchen employs professional chef preparing restaurant meals. Culinary presentation and culinary arts displayed in restaurant dishes. Dining experience showcases culinary excellence and restaurant hospitality.',
  
  'Healthy nutrition with nutritious ingredients and nutritional balance. Organic diet containing organic vegetables and organic produce. Nutrition science shows nutritional value of organic food. Dietary nutrition goals require nutritious meal planning. Nutrition expert advises nutrition recommendations for nutritious lifestyle.',
  
  'Pizza and pasta served as Italian cuisine dishes. Pasta sauce made from tomato and olive oil Italian ingredients. Pizza preparation using traditional pizza oven at high pizza temperature. Italian restaurant serving Italian food with Italian recipes. Pizza dough requiring Italian flour and Italian technique.',
  
  'Dessert recipes for chocolate cake and vanilla cake recipes. Cake baking requires cake flour and cake decorating skills. Chocolate dessert and chocolate cake are popular cake varieties. Cake frosting with cream cheese frosting on birthday cake. Dessert menu at restaurant featuring specialty desserts.'
]

console.log('Creating Document Clusterer with k=3 clusters...\n')

// Create a custom TfIdf instance with a comprehensive stopword list
// This keeps words that help distinguish between topics
const customStopwords = [
  // Common articles, prepositions, conjunctions
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our',
  'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
  // Generic words that appear across topics
  'about', 'more', 'very', 'just', 'some', 'any', 'all', 'each', 'every',
  'both', 'few', 'many', 'same', 'such', 'no', 'nor', 'not', 'only', 'own',
  'so', 'than', 'too', 'also', 'while', 'during', 'before', 'after', 'above',
  'below', 'through', 'between', 'into', 'up', 'down', 'out', 'over', 'under',
  // Numbers and measurements (as text)
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'first', 'second', 'third', 'several', 'multiple', 'various',
  // Weak verbs
  'make', 'made', 'get', 'got', 'go', 'went', 'come', 'came', 'use', 'used',
  'give', 'gave', 'take', 'took', 'see', 'saw', 'know', 'knew', 'think', 'thought'
]

const tfidf = new TfIdf()
tfidf.setStopwords(customStopwords)

// Create clusterer with 3 clusters using custom TfIdf
// Note: vocabulary is sorted by IDF (Inverse Document Frequency) by default,
// so the most discriminative terms are used for clustering
const clusterer = new DocumentClusterer(3, {
  tfidf: tfidf,
  minTermFrequency: 2,  // Keep terms appearing in any document (we have plenty now)
  maxFeatures: 150,     // Use top 150 discriminative terms with longer documents
  kmeans: {
    maxIterations: 500,  // Allow more iterations for convergence
    tolerance: 0.00001,  // Stricter convergence criteria
    seed: 123,           // Use seed for reproducibility
    restarts: 20,        // Multiple restarts for optimal clustering
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
