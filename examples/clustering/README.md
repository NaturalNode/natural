# Document Clustering with K-Means

This module provides document clustering functionality using K-Means clustering algorithm combined with TF-IDF vectorization.

## Features

- **K-Means Algorithm**: Robust implementation with k-means++ initialization
- **TF-IDF Vectorization**: Automatic document vectorization using term frequency-inverse document frequency
- **Easy-to-use API**: Simple interface for clustering documents
- **Prediction**: Assign new documents to existing clusters
- **Cluster Analysis**: Get top terms for each cluster to understand cluster themes
- **Serialization**: Save and load clustered models
- **Customizable**: Configure vocabulary size, term frequency, and clustering parameters

## Classes

### KMeans

Low-level K-Means clustering implementation that works with numeric vectors.

```javascript
const { KMeans } = require('natural');

const data = [
  [1, 2],
  [1.5, 1.8],
  [5, 8],
  [8, 8],
  [1, 0.6]
];

const kmeans = new KMeans(2, {
  maxIterations: 100,
  initialization: 'kmeans++' // or 'random'
});

kmeans.fit(data);
const assignments = kmeans.getAssignments();
const centroids = kmeans.getCentroids();
```

### DocumentClusterer

High-level document clustering that combines TF-IDF and K-Means.

```javascript
const { DocumentClusterer } = require('natural');

const clusterer = new DocumentClusterer(3);

// Add documents
clusterer.addDocument('This is about machine learning');
clusterer.addDocument('Natural language processing is fun');
clusterer.addDocument('Pizza is delicious');

// Perform clustering
clusterer.cluster();

// Get cluster assignments
const assignments = clusterer.getClusterAssignments();

// Get documents grouped by cluster
const clusters = clusterer.getClusters();

// Get top terms for each cluster
const clusterTerms = clusterer.getClusterTerms(5);

// Predict cluster for new document
const cluster = clusterer.predict('AI and machine learning are related');
```

## API Reference

### KMeans Constructor

```javascript
new KMeans(k, options)
```

**Parameters:**
- `k` (number): Number of clusters
- `options` (Object): Optional configuration
  - `maxIterations` (number): Maximum iterations (default: 100)
  - `tolerance` (number): Convergence tolerance (default: 0.0001)
  - `initialization` (string): 'random' or 'kmeans++' (default: 'kmeans++')

**Methods:**
- `fit(data)`: Fit the model to data
- `predict(data)`: Predict cluster assignments
- `getCentroids()`: Get cluster centroids
- `getAssignments()`: Get cluster assignments for training data
- `getClusters()`: Get point indices for each cluster

### DocumentClusterer Constructor

```javascript
new DocumentClusterer(k, options)
```

**Parameters:**
- `k` (number): Number of clusters
- `options` (Object): Optional configuration
  - `kmeans` (Object): KMeans configuration
  - `tfidf` (Object): TfIdf instance or configuration
  - `minTermFrequency` (number): Minimum term frequency (default: 0)
  - `maxFeatures` (number): Maximum vocabulary size (default: null)

**Methods:**
- `addDocument(document, key)`: Add a document
- `cluster(kmeansOptions)`: Perform clustering
- `getClusterAssignments()`: Get cluster index for each document
- `getClusters()`: Get documents grouped by cluster
- `getClusterTerms(topN)`: Get top N terms for each cluster
- `predict(document)`: Predict cluster for new document
- `getStatistics()`: Get clustering statistics
- `toJSON()`: Serialize clusterer
- `DocumentClusterer.fromJSON(json)`: Deserialize clusterer

## Examples

### Basic Document Clustering

```javascript
const { DocumentClusterer } = require('natural');

const clusterer = new DocumentClusterer(2);

// Add documents about different topics
clusterer.addDocument('The cat sat on the mat');
clusterer.addDocument('Dogs are loyal pets');
clusterer.addDocument('JavaScript is a programming language');
clusterer.addDocument('Python is great for data science');

// Cluster documents
clusterer.cluster();

// View results
const clusters = clusterer.getClusters();
clusters.forEach((cluster, i) => {
  console.log(`Cluster ${i}:`);
  cluster.forEach(doc => {
    console.log(`  - ${doc.text}`);
  });
});
```

### Understanding Clusters

```javascript
// Get top terms for each cluster
const clusterTerms = clusterer.getClusterTerms(5);
clusterTerms.forEach((terms, i) => {
  console.log(`Cluster ${i} top terms:`);
  terms.forEach(({ term, score }) => {
    console.log(`  ${term}: ${score.toFixed(4)}`);
  });
});

// Get statistics
const stats = clusterer.getStatistics();
console.log(`Clustered ${stats.numDocuments} documents into ${stats.numClusters} clusters`);
console.log(`Cluster sizes: ${stats.clusterSizes.join(', ')}`);
```

### Predicting New Documents

```javascript
// After clustering, predict cluster for new documents
const newDoc = 'Cats and dogs are both popular pets';
const cluster = clusterer.predict(newDoc);
console.log(`New document belongs to cluster ${cluster}`);
```

### Advanced Configuration

```javascript
const clusterer = new DocumentClusterer(3, {
  minTermFrequency: 2,    // Ignore rare terms
  maxFeatures: 100,        // Limit vocabulary size
  kmeans: {
    maxIterations: 200,
    initialization: 'kmeans++',
    tolerance: 0.0001
  }
});
```

### Serialization

```javascript
// Save clusterer
const json = clusterer.toJSON();
const serialized = JSON.stringify(json);

// Load clusterer
const restored = DocumentClusterer.fromJSON(JSON.parse(serialized));
const prediction = restored.predict('some new document');
```

## How It Works

1. **Vectorization**: Documents are converted to TF-IDF vectors
   - TF (Term Frequency): How often a term appears in a document
   - IDF (Inverse Document Frequency): How unique a term is across all documents

2. **K-Means Clustering**: Vectors are clustered using K-Means
   - Initialize k centroids (using k-means++ for better results)
   - Assign each document to nearest centroid
   - Update centroids based on assignments
   - Repeat until convergence

3. **Analysis**: Extract insights from clusters
   - Identify top terms per cluster
   - Assign new documents to clusters

## Tips for Best Results

1. **Choose appropriate k**: Too few clusters oversimplify, too many overfits
2. **Clean your text**: Remove noise, normalize text before clustering
3. **Filter vocabulary**: Use `minTermFrequency` and `maxFeatures` to focus on meaningful terms
4. **Use k-means++**: Default initialization usually works better than random
5. **Consider document length**: Very short or very long documents may need preprocessing

## See Also

- [TF-IDF](../tfidf)
- [Classifiers](../classifiers)
- [Tokenizers](../tokenizers)
