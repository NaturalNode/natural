# Document Clustering Examples

This directory contains three progressively advanced examples of document clustering using the `DocumentClusterer` class. Each example demonstrates different techniques, datasets, and use cases.

## Quick Start

Run any example with:

```bash
# Basic example - fast, in-memory demo
node examples/clustering/document_clustering_example.js

# BBC News dataset - realistic dataset with high purity
node examples/clustering/BBC_news_example.js

# 20 Newsgroups dataset - large-scale with advanced preprocessing
node examples/clustering/newsgroups_example.js
```

## Examples Overview

### 1. Basic Document Clustering (`document_clustering_example.js`)

**Purpose**: Learn clustering fundamentals with synthetic data

**Dataset**: 
- 12 in-memory documents
- 3-4 topics: Sports, Technology, Food
- Strong vocabulary differentiation (deliberate repetition for clarity)

**Features**:
- Simple clustering setup
- No file I/O
- Readable output format
- Good for understanding how clustering works

**Expected Output**:
- Time: <1 second
- Purity: ~95-100% (synthetic data with clear separation)
- Clusters: 3 coherent topic groups

**When to Use**:
- Learning clustering concepts
- Testing clusterer configuration changes
- Quick debugging

**Key Code**:
```javascript
const clusterer = new DocumentClusterer(3, {
  maxFeatures: 300,
  minTermFrequency: 1
});

clusterer.addDocument('Basketball game with basketball player...', 'doc_1');
clusterer.addDocument('Python programming language...', 'doc_4');
// ... more documents

clusterer.cluster();
const clusters = clusterer.getClusters();
```

---

### 2. BBC News Dataset (`BBC_news_example.js`)

**Purpose**: Demonstrate real-world clustering on news data with high accuracy

**Dataset**:
- 2,225 BBC News articles
- 5 categories: business, entertainment, politics, sport, entertainment
- Average article length: 500+ words
- Source: [BBC News CSV dataset](https://www.kaggle.com/datasets/c7f3a21ff819374f66ef451658fb3019)

**Features**:
- Real-world multi-labeled articles
- Preprocessing with stemming
- MultiLabel purity evaluation
- Comprehensive statistics and metrics

**Performance**:
- Time: 5-20 seconds
- Purity: 80-87% (very strong for real-world data)
- Clusters: 5 well-separated news categories

**When to Use**:
- Demonstrating effective clustering on real data
- Showing high-purity results for presentations
- Understanding multi-label evaluation metrics
- Baseline for comparison with other algorithms

**Key Techniques**:
```javascript
// Stemming for word normalization
function stemText(text) {
  return text.toLowerCase()
    .split(/\s+/)
    .map(word => PorterStemmer.stem(word))
    .join(' ');
}

// Custom stopwords
const additionalStopwords = ['mr', 'ms', 'told', 'said', 'says', 'added'];

// Multi-label evaluation
const calculatePurity = (docKeys) => {
  // Check if pairs share ANY tag (multi-label)
  const hasSharedTag = tagsI.some(tag => tagsJ.includes(tag));
};
```

**Output Example**:
```
Overall Purity: 85.3%
(% of document pairs within clusters sharing at least one tag)

Vector Analysis:
  Average sparsity: 98.2%
  Average non-zero features per doc: 18.5 out of 400

Clustering Statistics:
  Number of clusters: 5
  Number of documents: 2225
  Vocabulary size: 400
  Cluster imbalance: 22.4%
```

---

### 3. 20 Newsgroups Dataset (`newsgroups_example.js`)

**Purpose**: Advanced clustering on diverse text with preprocessing optimization

**Dataset**:
- 37,068 total newsgroup messages
- 20 categories (comp.*, rec.*, sci.*, soc.*, talk.*)
- Sample size: 10,000 documents (configurable)
- Highly diverse, overlapping categories

**Features**:
- **Advanced preprocessing**:
  - Punctuation and number filtering
  - Stemmed stopword filtering (after stemming, not before)
  - Subject line keyword extraction for multi-label
- **Random document sampling** (Fisher-Yates shuffle) for representative results
- **Dual purity metrics**: Single-label and multi-label evaluation
- **Comprehensive analysis**: Top terms, category distributions, per-cluster statistics

**Performance**:
- Time: 10-30 seconds
- Purity: 42-43% single-label (honest unsupervised baseline)
- Purity: 46% multi-label (keywords add ~2-3 percentage points)
- Best clusters: 67-97% (well-separated topics like motorcycles, politics)
- Catch-all clusters: 6-25% (generic vocabulary, expected with diverse data)

**When to Use**:
- Understanding limitations of unsupervised clustering
- Realistic expectation-setting (not all data clusters cleanly)
- Learning advanced text preprocessing
- Evaluating trade-offs between random vs. sequential sampling

**Key Techniques**:

1. **Aggressive Preprocessing**:
```javascript
function stemText(text) {
  return text.toLowerCase()
    .split(/\s+/)
    .filter(word => /^[a-z]+$/.test(word))  // Alphabetic only
    .map(word => PorterStemmer.stem(word))
    .filter(word => word.length > 2)       // Remove ultra-short
    .filter(word => !stemmedStopwords.has(word))  // Stemmed stopword filter
    .join(' ');
}
```

2. **Multi-Label Keywords**:
```javascript
function extractSubjectCategories(subject) {
  // Extract 3 top keywords from subject line
  const words = subject
    .replace(/^(Re:|Fwd?:|Was:)\s*/gi, '')  // Remove prefixes
    .split(/\s+/)
    .filter(w => w.length > 3)
    .map(w => PorterStemmer.stem(w))
    .filter((v, i, a) => a.indexOf(v) === i);  // Unique
  
  return words.slice(0, 3);
}
```

3. **Random Sampling** (Fisher-Yates):
```javascript
// Shuffle documents randomly (not sequential from CSV)
for (let i = allDocs.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [allDocs[i], allDocs[j]] = [allDocs[j], allDocs[i]];
}
const sampledDocs = allDocs.slice(0, MAX_DOCS);
```

4. **Dual Purity Metrics**:
```javascript
// Single-label: same primary newsgroup
const calculateSingleLabelPurity = (docKeys) => {
  if (catI === catJ) pairsFromSameCategory++;
};

// Multi-label: share ANY category (newsgroup + keywords)
const calculateMultiLabelPurity = (docKeys) => {
  const hasSharedCategory = catsI.some(cat => catsJ.includes(cat));
};
```

**Configuration**:
```javascript
const MAX_DOCS = process.env.MAX_DOCS ? parseInt(process.env.MAX_DOCS) : 10000;
const MIN_DOC_LENGTH = 100;  // Filter short documents

const clusterer = new DocumentClusterer(18, {  // k=18 clusters
  maxFeatures: 750,           // Larger vocabulary
  minTermFrequency: 5,        // Only keep frequent terms
  kmeans: {
    restarts: 30,
    maxIterations: 300,
    initialization: 'kmeans++'
  }
});
```

**Running with Different Sizes**:
```bash
# Default: 10,000 documents
node examples/clustering/newsgroups_example.js

# 5,000 documents (faster)
MAX_DOCS=5000 node examples/clustering/newsgroups_example.js

# 20,000 documents (slower, demonstrates scaling)
MAX_DOCS=20000 node examples/clustering/newsgroups_example.js
```

**Output Example**:
```
Overall Multi-Label Purity: 46.2%
  (% of document pairs within clusters sharing at least one category)

Overall Single-Label Purity: 43.7%
  (% of document pairs within clusters from same primary newsgroup)

Top Clusters by Purity:
  Cluster 15 (rec.motorcycles): 96.8% purity, 245 docs
  Cluster 8 (talk.politics.mideast): 79.3% purity, 248 docs
  Cluster 2 (sci.crypt): 59.4% purity, 308 docs

Catch-All Cluster:
  Cluster 1: 4,474 docs (44.7%), 6.1% purity
  Top categories: sci.med (526), sci.electronics (390), comp.graphics (342)
```

---

## Comparison Table

---

## Dataset Preparation

### BBC News Dataset
Must be obtained from Kaggle:
1. Download [BBC News CSV](https://www.kaggle.com/datasets/c7f3a21ff819374f66ef451658fb3019)
2. Place as `examples/clustering/data/BBCNews.csv`
3. Ensure CSV has columns: `descr` (article text), `tags` (comma-separated)

### 20 Newsgroups Dataset
Auto-generated from raw newsgroup files:
```bash
# First-time setup (converts 20 newsgroup .txt files to CSV)
node examples/clustering/parse_all_newsgroups.js \
  examples/clustering/data/20_newsgroups \
  examples/clustering/data/combined_newsgroups.csv

# Generates combined_newsgroups.csv with all documents
# Then run: node examples/clustering/newsgroups_example.js
```

---

## Understanding the Output

### Purity Metrics

**Multi-Label Purity** (BBC, Newsgroups):
- Measures % of document pairs within clusters that share ≥1 category/tag
- Higher is better; 80%+ is excellent
- Appropriate when documents can have multiple labels

**Single-Label Purity** (20 Newsgroups only):
- Measures % of document pairs from same newsgroup
- More strict than multi-label
- Reflects realistic clustering (newsgroups have one primary category)

### Vocabulary Size
- Called "maxFeatures" - limits terms to most important ones
- BBC News: 400 features (news has lower dimensionality)
- 20 Newsgroups: 750 features (diverse topics need more vocabulary)

### Vector Sparsity
- Percentage of zero-valued features per document
- Normal range: 95-99%
- Indicates most documents use only subset of vocabulary (expected)

### Cluster Imbalance
- Measures how evenly documents distribute across clusters
- 0% = perfectly balanced
- High imbalance (>70%) can indicate:
  - Natural uneven topic distribution
  - k value too high for data
  - Preprocessing removing important signals

---

## Troubleshooting

### Example runs but all documents in one cluster
**Cause**: Preprocessing too aggressive, all documents become empty or identical
**Fix**: 
- Reduce stopword filtering
- Increase minTermFrequency to 2 or lower
- Check that file paths are correct

### Very low purity (<30%)
**Expected Behavior**: 
- 20 Newsgroups naturally has overlapping categories (comp.graphics vs comp.windows.x)
- 42-46% purity is realistic for this dataset without neural networks
- BBC News should show 80%+ purity as sanity check

**If BBC News showing low purity**:
- Verify CSV format (needs `descr` and `tags` columns)
- Check stopword list isn't too aggressive
- Examine cluster composition (see top categories per cluster)

### Out of Memory
**Solution**:
- Reduce MAX_DOCS for 20 Newsgroups
- Use 5,000 or 7,500 instead of 10,000
- Reduce maxFeatures from 750 to 500

---

## Next Steps

### Extending the Examples

1. **Try different k values**:
   ```bash
   # Test clustering with 5, 10, 15 clusters
   # Observe how purity changes
   ```

2. **Add custom preprocessing**:
   - Implement bigram extraction
   - Add domain-specific stopwords
   - Try Word2Vec embeddings instead of TF-IDF

3. **Evaluate with other metrics**:
   - Silhouette score (internal, no labels needed)
   - NMI/ARI (if ground truth available)
   - Calinski-Harabasz index

4. **Scale up**:
   - Use all 37,068 newsgroup documents
   - Implement distributed K-Means
   - Profile performance bottlenecks

---

## References

- **Document Clusterer API**: See [lib/natural/classifiers/document_clusterer/README.md](../../lib/natural/classifiers/document_clusterer/README.md)
- **BBC News Dataset**: [Kaggle Dataset](https://www.kaggle.com/datasets/c7f3a21ff819374f66ef451658fb3019)
- **20 Newsgroups**: [Classic ML dataset](http://qwone.com/~jason/20Newsgroups/)
- **TF-IDF**: [Wikipedia](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
- **K-Means**: [Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)
- **Porter Stemmer**: [Snowball](https://snowballstem.org/)
