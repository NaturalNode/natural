const fs = require('fs');
const csv = require('csv-parser');
const { DocumentClusterer, TfIdf, PorterStemmer } = require('../../lib/natural');

// Stem document text to reduce word variants
function stemText(text) {
  return text.toLowerCase()
    .split(/\s+/)
    .map(word => PorterStemmer.stem(word))
    .join(' ');
}

// Create custom TfIdf with stopwords
const tfidf = new TfIdf();

const additionalStopwords = [
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 
  'one', 'two', 'three', 'first', 'second', 'last', 'next',
  'year', 'years', 'time', 'day', 'days', 'week', 'month',
  'new', 'old', 'good', 'best', 'better', 
  'mr', 'ms', 'mrs', 'told', 'said', 'says', 'added',
  'just', 'also', 'now', 'back', 'made', 'make', 'get',
  'people', 'number', 'way', 'well', 'called', 'set'
];

const defaultStopwords = require('stopwords-iso').en;
const allStopwords = [...new Set([...defaultStopwords, ...additionalStopwords])];
tfidf.setStopwords(allStopwords);

const clusterer = new DocumentClusterer(5, {
  tfidf: tfidf,
  minTermFrequency: 5,
  maxFeatures: 400,
  kmeans: { 
    restarts: 30,
    maxIterations: 300,
    initialization: 'kmeans++'
  }
});

let docCount = 0;
const allDocTags = {}; // Map: docIndex -> array of all tags
let docIndex = 0;

fs.createReadStream('./examples/clustering/data/BBCNews.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Filter out very short documents
    if (row.descr && row.descr.trim().length > 500) {
      const docText = row.descr;
      const stemmedText = stemText(docText);
      
      // Extract ALL tags - all are equally important
      const allTags = row.tags ? row.tags.split(',').map(t => t.trim()) : ['unknown'];
      
      // Store tags for this document using its index
      allDocTags[docIndex] = allTags;
      
      // Use document index as key so we can look up tags later
      clusterer.addDocument(stemmedText, `doc_${docIndex}`);
      
      docIndex++;
      docCount++;
      if (docCount <= 3) {
        console.log(`Doc ${docCount} (idx ${docIndex-1}): [${allTags.join(', ')}]`);
        console.log(`  Text: "${docText.substring(0, 80)}..."`);
      }
    }
  })
  .on('end', () => {
    console.log(`\nTotal documents loaded: ${docCount}\n`);
    
    if (docCount === 0) {
      console.error('No documents loaded! Check CSV file format.');
      return;
    }
    
    // Show tag statistics
    console.log('Tag Statistics:');
    console.log('-----------------------------');
    const allTagsSet = new Set();
    Object.values(allDocTags).forEach(tags => {
      tags.forEach(tag => allTagsSet.add(tag));
    });
    console.log(`Total unique tags: ${allTagsSet.size}`);
    
    // Count tag frequency
    const tagCounts = {};
    Object.values(allDocTags).forEach(tags => {
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    console.log('Top 10 tags:');
    topTags.forEach(([tag, count]) => {
      console.log(`  ${tag}: ${count} documents`);
    });
    console.log();
    
    console.log('Building vocabulary and clustering...\n');
    
    // Helper function to calculate multi-label purity
    const calculateMultiLabelPurity = (clusterDocIndices) => {
      if (clusterDocIndices.length < 2) return 100; // Single doc trivially matches itself
      
      let pairsWithSharedTags = 0;
      let totalPairs = 0;
      
      // Check all pairs of documents
      for (let i = 0; i < clusterDocIndices.length; i++) {
        for (let j = i + 1; j < clusterDocIndices.length; j++) {
          totalPairs++;
          
          const tagsI = allDocTags[clusterDocIndices[i]] || [];
          const tagsJ = allDocTags[clusterDocIndices[j]] || [];
          
          // Check if they share at least one tag
          const hasSharedTag = tagsI.some(tag => tagsJ.includes(tag));
          if (hasSharedTag) {
            pairsWithSharedTags++;
          }
        }
      }
      
      return totalPairs > 0 ? (pairsWithSharedTags / totalPairs * 100) : 100;
    };
    
    clusterer.cluster();
    
    // Vector analysis
    const vectors = clusterer.documentVectors;
    let totalNonZero = 0;
    let totalElements = 0;
    
    vectors.forEach(vec => {
      const nonZero = vec.filter(v => v !== 0).length;
      totalNonZero += nonZero;
      totalElements += vec.length;
    });
    
    const avgSparsity = (1 - totalNonZero / totalElements) * 100;
    console.log('Vector Analysis:');
    console.log('----------------');
    console.log(`Average sparsity: ${avgSparsity.toFixed(1)}%`);
    console.log(`Average non-zero features per doc: ${(totalNonZero / vectors.length).toFixed(1)} out of ${vectors[0].length}`);
    
    if (vectors.length >= 3) {
      const dist01 = Math.sqrt(vectors[0].reduce((sum, v, i) => sum + (v - vectors[1][i])**2, 0));
      const dist02 = Math.sqrt(vectors[0].reduce((sum, v, i) => sum + (v - vectors[2][i])**2, 0));
      const dist12 = Math.sqrt(vectors[1].reduce((sum, v, i) => sum + (v - vectors[2][i])**2, 0));
      console.log(`Sample inter-document distances: ${dist01.toFixed(4)}, ${dist02.toFixed(4)}, ${dist12.toFixed(4)}`);
    }
    console.log();
    
    const stats = clusterer.getStatistics();
    console.log('Clustering Statistics:');
    console.log('---------------------');
    console.log(`Number of clusters: ${stats.numClusters}`);
    console.log(`Number of documents: ${stats.numDocuments}`);
    console.log(`Vocabulary size: ${stats.vocabularySize}`);
    console.log(`Cluster sizes: ${stats.clusterSizes.join(', ')}`);
    
    const avgSize = docCount / stats.numClusters;
    const imbalance = stats.clusterSizes.map(s => Math.abs(s - avgSize) / avgSize).reduce((a, b) => a + b) / stats.numClusters;
    console.log(`Cluster imbalance: ${(imbalance * 100).toFixed(1)}%\n`);
    
    // Cluster analysis with multi-label purity
    const clusters = clusterer.getClusters();
    let totalMultiLabelPurity = 0;
    
    clusters.forEach((cluster, idx) => {
      console.log(`Cluster ${idx} (${cluster.length} documents):`);
      
      if (cluster.length > 0) {
        // Extract document indices from cluster keys
        const docIndices = cluster.map(doc => {
          const match = doc.key.match(/doc_(\d+)/);
          return match ? parseInt(match[1]) : -1;
        }).filter(i => i >= 0);
        
        // Calculate multi-label purity for this cluster
        const mlPurity = calculateMultiLabelPurity(docIndices);
        totalMultiLabelPurity += mlPurity;
        
        // Show tag distribution
        const clusterTagDist = {};
        docIndices.forEach(docIdx => {
          const tags = allDocTags[docIdx] || [];
          tags.forEach(tag => {
            clusterTagDist[tag] = (clusterTagDist[tag] || 0) + 1;
          });
        });
        
        console.log(`  Multi-label purity: ${mlPurity.toFixed(1)}% (documents sharing tags)`);
        console.log(`  Top tags:`);
        Object.entries(clusterTagDist)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .forEach(([tag, count]) => {
            console.log(`    ${tag}: ${count}`);
          });
        
        console.log(`  Sample documents with ALL tags:`);
        docIndices.slice(0, 2).forEach(idx => {
          const tags = allDocTags[idx] || [];
          console.log(`    [${tags.join(', ')}]`);
        });
      }
      console.log();
    });
    
    // Overall multi-label purity
    const overallMultiLabelPurity = clusters.length > 0 ? totalMultiLabelPurity / clusters.length : 0;
    console.log(`Overall Multi-Label Clustering Purity: ${overallMultiLabelPurity.toFixed(1)}%`);
    console.log('(% of document pairs within clusters that share at least one tag)\n');
    
    // Show top terms per cluster
    console.log('Top 10 Terms by Cluster:');
    const clusterTerms = clusterer.getClusterTerms(10);
    clusterTerms.forEach((terms, idx) => {
      console.log(`\nCluster ${idx}:`);
      terms.forEach(({ term, score }) => {
        console.log(`  ${term}: ${score.toFixed(4)}`);
      });
    });
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err);
  });
