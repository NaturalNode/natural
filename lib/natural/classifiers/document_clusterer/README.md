# Document Clusterer

The `DocumentClusterer` is a text clustering module that groups documents into semantic clusters using K-Means clustering with TF-IDF vectorization. It's designed to discover hidden structure in unorganized document collections.

## Overview

### What It Does

- **Vectorizes documents** using TF-IDF (Term Frequency-Inverse Document Frequency) to convert text into numerical features
- **Groups documents** into k clusters using K-Means algorithm
- **Identifies topics** by analyzing the top terms in each cluster
- **Evaluates cluster quality** by examining category distributions and term relevance

### Key Features

- **TF-IDF Vectorization**: Converts documents to sparse vectors capturing term importance
- **K-Means Clustering**: Fast, scalable clustering with configurable k (number of clusters)
- **Porter Stemming**: Reduces words to root forms for better grouping
- **Stopword Filtering**: Removes common words that don't contribute to clustering
- **Configurable Parameters**: Control vocabulary size, term frequency, and K-Means behavior

## How It Works

### 1. Document Input
Documents are added to the clusterer as text strings with optional document keys for tracking:

```javascript
clusterer.addDocument('document text here', 'doc_key_1');
clusterer.addDocument('another document', 'doc_key_2');
```

### 2. TF-IDF Vectorization
Each document is converted to a sparse vector representing term importance:
- **Frequency**: How often each term appears in the document
- **Inverse Document Frequency**: How rare the term is across all documents (rare terms weighted higher)
- **Normalization**: L2 normalization ensures comparable vector magnitudes

### 3. K-Means Clustering
Documents are grouped into k clusters by:
- Initializing cluster centers (using kmeans++ for better initialization)
- Iteratively assigning documents to nearest centers
- Updating cluster centers based on assigned documents
- Repeating until convergence or max iterations reached

### 4. Cluster Analysis
After clustering, you can examine:
- Cluster membership and sizes
- Top terms per cluster (highest TF-IDF scores)
- Document distribution within clusters
- Category composition (if using multi-label evaluation)

## Usage

### Basic Example

```javascript
const { DocumentClusterer } = require('natural');

const clusterer = new DocumentClusterer(5, {
  maxFeatures: 400,
  minTermFrequency: 2
});

// Add documents
clusterer.addDocument('machine learning algorithms with neural networks', 'doc_1');
clusterer.addDocument('deep learning and artificial intelligence techniques', 'doc_2');
clusterer.addDocument('basketball scoring and game strategy', 'doc_3');
clusterer.addDocument('football tactics and team coordination', 'doc_4');

// Cluster the documents
clusterer.cluster();

// Get results
const clusters = clusterer.getClusters();
const stats = clusterer.getStatistics();

console.log(`${stats.numClusters} clusters found`);
console.log(`Vocabulary size: ${stats.vocabularySize}`);
clusters.forEach((cluster, idx) => {
  console.log(`Cluster ${idx}: ${cluster.length} documents`);
});
```

### With Custom TF-IDF

```javascript
const { DocumentClusterer, TfIdf, PorterStemmer } = require('natural');

const customTfidf = new TfIdf();
const stopwords = ['the', 'a', 'and', 'or', 'but'];
customTfidf.setStopwords(stopwords);

const clusterer = new DocumentClusterer(5, {
  tfidf: customTfidf,
  maxFeatures: 400,
  minTermFrequency: 5
});

// Add documents with preprocessing
clusterer.addDocument(stemText(doc1), 'doc_1');
clusterer.addDocument(stemText(doc2), 'doc_2');

clusterer.cluster();
```

## Configuration Options

### Constructor Parameters

```javascript
new DocumentClusterer(k, options)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| k | number | 3 | Number of clusters to create |
| options | object | {} | Configuration options (see below) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| tfidf | TfIdf | new TfIdf() | Custom TF-IDF vectorizer instance |
| minTermFrequency | number | 2 | Minimum document count for a term to be included |
| maxFeatures | number | 300 | Maximum vocabulary size (most important terms) |
| kmeans | object | {} | K-Means specific configuration |

### K-Means Options

```javascript
kmeans: {
  restarts: 10,           // Number of random restarts (default: 10)
  maxIterations: 300,     // Max iterations per restart (default: 300)
  initialization: 'kmeans++' // 'kmeans++' or 'random' (default: 'kmeans++')
}
```

## API Reference

### Methods

#### `addDocument(text, key)`
Add a document to the clusterer.
- `text` (string): Document text to cluster
- `key` (string, optional): Unique identifier for the document

#### `cluster()`
Perform K-Means clustering on all added documents.

#### `getClusters()`
Returns array of clusters, where each cluster is an array of documents.

```javascript
[
  [
    { key: 'doc_1', content: 'text...' },
    { key: 'doc_2', content: 'text...' }
  ],
  [
    { key: 'doc_3', content: 'text...' }
  ]
]
```

#### `getStatistics()`
Returns clustering statistics.

```javascript
{
  numClusters: 5,
  numDocuments: 1000,
  vocabularySize: 450,
  clusterSizes: [200, 250, 180, 200, 170]
}
```

#### `getClusterTerms(n)`
Get top n terms per cluster.

```javascript
clusterer.getClusterTerms(10).forEach((terms, clusterIdx) => {
  terms.forEach(({ term, score }) => {
    console.log(`${term}: ${score}`);
  });
});
```

## Understanding Results

### Purity Metrics

**Cluster Purity**: Percentage of document pairs within clusters that share a category
- High purity (>70%): Strong semantic coherence, good topic separation
- Moderate purity (40-70%): Mixed categories, overlapping topics
- Low purity (<40%): Poor separation, noisy clusters

### Vector Sparsity

Most documents use only a small fraction of vocabulary features.
- Typical sparsity: 95-99%
- This is normal for text data and doesn't indicate a problem

### Cluster Imbalance

Measures how evenly documents are distributed across clusters.
- Balanced clusters: 10-30% imbalance
- Imbalanced clusters: >70% imbalance can indicate:
  - Natural data distribution (some topics more common)
  - K value too high (too many clusters for data)
  - Preprocessing removing important discriminative terms

## Preprocessing Best Practices

### Text Normalization

```javascript
function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  // Remove punctuation
    .split(/\s+/)
    .filter(word => /^[a-z]+$/.test(word))  // Keep only alphabetic
    .map(word => PorterStemmer.stem(word))
    .filter(word => word.length > 2)  // Remove very short words
    .join(' ');
}
```

### Stopword Handling

Apply stopwords **after** stemming, not before:

```javascript
// Create stemmed stopwords set
const stemmedStopwords = new Set(
  stopwordList.map(word => PorterStemmer.stem(word))
);

// Filter stemmed tokens
const terms = text.split(/\s+/)
  .map(word => PorterStemmer.stem(word))
  .filter(word => !stemmedStopwords.has(word))
  .join(' ');
```

## Performance Considerations

### Document Count
- **100-1,000 documents**: Very fast (<1s), good for testing
- **1,000-10,000 documents**: Fast (1-30s), practical for most use cases
- **10,000+ documents**: Slower (30s+), consider sampling or distributed clustering

### Vocabulary Size
- **Small vocabulary (100-200)**: Faster, rougher clusters
- **Medium vocabulary (300-750)**: Balance speed and quality
- **Large vocabulary (1,000+)**: Better discrimination, slower clustering

### Number of Clusters (k)
- Too small k: Combines unrelated documents (low purity)
- Too large k: Fragments related documents (many small clusters)
- Optimal k typically 5-20 depending on dataset size and diversity

## Common Issues

### Low Purity
**Causes**: 
- Too many similar categories in dataset
- Insufficient preprocessing (stopwords not removed)
- Category names in text (data leakage)
- k value too low

**Solution**: 
- Check that category labels aren't in document text
- Increase stopword filtering
- Adjust k value
- Examine top terms in weak clusters

### Catch-All Cluster
**Causes**:
- Generic vocabulary (common words)
- Underscore/corruption in text
- Numeric-only documents

**Solution**:
- Filter punctuation and numbers before stemming
- Add more aggressive stopword filtering
- Increase minTermFrequency

### Unbalanced Clusters
**Causes**:
- Natural data distribution
- k value too high
- Documents grouped by non-semantic features

**Solution**:
- Verify k is appropriate for dataset size
- Check preprocessing isn't removing important terms
- Increase restarts for K-Means

## Examples

See the [Examples README](../../examples/clustering/README.md) for:
- Basic clustering with in-memory documents
- BBC News dataset clustering (84%+ purity)
- 20 Newsgroups clustering with advanced preprocessing (42% purity)
