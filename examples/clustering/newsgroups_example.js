/**
 * 20 Newsgroups Clustering Example
 * 
 * Dataset: 20 Newsgroups - classic text classification/clustering dataset  
 * Total: 37,068 documents across 20 newsgroups
 * 
 * This example samples the dataset to make clustering faster.
 * Set MAX_DOCS to control sample size (default: 5000)
 */

const fs = require('fs');
const csv = require('csv-parser');
const { DocumentClusterer, TfIdf, PorterStemmer } = require('../../lib/natural');

// Build stemmed stopwords set (apply stopwords AFTER stemming for better filtering)
const additionalStopwords = [
  'article', 'writes', 'subject', 'lines', 'nntp', 'host', 'organization',
  'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'one', 'two', 'three', 'first', 'second', 'last', 'next',
  'year', 'years', 'time', 'day', 'days', 'week', 'month',
  'new', 'old', 'good', 'best', 'better',
  'just', 'also', 'now', 'back', 'made', 'make', 'get',
  'people', 'number', 'way', 'well', 'called', 'set',
  // Generic terms dominating catch-all clusters
  'any', 'has', 'have', 'was', 'anyone', 'does', 'please',
  'thing', 'things', 'these', 'those', 'know', 'use', 'used'
];

const defaultStopwords = require('stopwords-iso').en;
const allStopwords = [...new Set([...defaultStopwords, ...additionalStopwords])];

// Stem all stopwords so we can filter after stemming
const stemmedStopwords = new Set(
  allStopwords.map(word => PorterStemmer.stem(word.toLowerCase()))
);

// Stem document text and filter out punctuation/numbers and stopwords AFTER stemming
function stemText(text) {
  return text.toLowerCase()
    .split(/\s+/)
    .filter(word => /^[a-z]+$/.test(word))  // Keep only alphabetic tokens
    .map(word => PorterStemmer.stem(word))
    .filter(word => word.length > 2)  // Remove ultra-short stemmed words
    .filter(word => !stemmedStopwords.has(word))  // Remove stemmed stopwords
    .join(' ');
}

// Extract meaningful keywords from subject line as categories
function extractSubjectCategories(subject) {
  if (!subject || subject.length < 3) return [];
  
  // Remove common prefixes and noise
  const cleaned = subject
    .replace(/^(Re:|Fwd?:|Was:)\s*/gi, '')
    .replace(/["<>()\[\]{}]/g, ' ')
    .toLowerCase();
  
  // Split into words, stem, filter meaningful ones
  const words = cleaned
    .split(/\s+/)
    .filter(w => w.length > 3)  // Skip short words
    .filter(w => !['that', 'this', 'with', 'from', 'have', 'what', 'when', 'where', 'about'].includes(w))
    .map(w => PorterStemmer.stem(w))
    .filter((v, i, a) => a.indexOf(v) === i);  // Unique
  
  // Take top 3 most meaningful stems
  return words.slice(0, 3);
}

// Create clusterer with optimized parameters
const tfidf = new TfIdf();
// Note: Stopword filtering is done in stemText() AFTER stemming for better accuracy

const MAX_DOCS = process.env.MAX_DOCS ? parseInt(process.env.MAX_DOCS) : 10000;
const MIN_DOC_LENGTH = 100; // Longer docs for better quality

const clusterer = new DocumentClusterer(18, {
  tfidf: tfidf,
  minTermFrequency: 5,
  maxFeatures: 750,
  kmeans: {
    restarts: 30,
    maxIterations: 300,
    initialization: 'kmeans++'
  }
});

let docCount = 0;
let totalSeen = 0;
const allDocCategories = {}; // Map: doc_X -> [categories with keywords]
const primaryCategories = {}; // Map: doc_X -> primary newsgroup only

console.log(`Loading newsgroups dataset (sampling ${MAX_DOCS} documents)...\n`);

const csvPath = './data/20_newsgroups/combined_newsgroups.csv';

if (!fs.existsSync(csvPath)) {
  console.error(`Dataset not found at ${csvPath}`);
  console.error('\nTo generate the combined newsgroups dataset:');
  console.error('  node examples/clustering/parse_all_newsgroups.js \\');
  console.error('    examples/clustering/data/20_newsgroups \\');
  console.error('    examples/clustering/data/combined_newsgroups.csv');
  process.exit(1);
}

// First pass: Load all documents that meet criteria
const allDocs = [];

console.log('Loading and filtering documents...\n');

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    const docText = row.text || row.content;
    const category = row.category || row.group || row.label;
    const subject = row.subject || '';
    
    if (docText && docText.trim().length > MIN_DOC_LENGTH && category) {
      allDocs.push({ docText, category, subject });
    }
  })
  .on('end', () => {
    console.log(`Total documents meeting criteria: ${allDocs.length}`);
    
    // Randomly shuffle documents using Fisher-Yates algorithm
    for (let i = allDocs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allDocs[i], allDocs[j]] = [allDocs[j], allDocs[i]];
    }
    
    // Take random sample
    const sampleSize = Math.min(MAX_DOCS, allDocs.length);
    const sampledDocs = allDocs.slice(0, sampleSize);
    
    console.log(`Randomly sampled ${sampleSize} documents\n`);
    
    // Process sampled documents
    sampledDocs.forEach((doc, idx) => {
      const { docText, category, subject } = doc;
      
      // Stem subject and body
      const stemmedSubject = stemText(subject);
      const stemmedBody = stemText(docText);
      
      // Combine only content (NOT category - that would leak ground truth)
      const combinedText = `${stemmedSubject} ${stemmedBody}`;
      
      // Extract subject keywords as additional categories
      const subjectCategories = extractSubjectCategories(subject);
      
      // Use doc key for reliable lookup
      const docKey = `doc_${idx}`;
      allDocCategories[docKey] = [category, ...subjectCategories];
      primaryCategories[docKey] = category; // Store primary newsgroup only
      
      // Use doc index as key
      clusterer.addDocument(combinedText, docKey);
      
      docCount++;
      
      if (docCount <= 3) {
        console.log(`Doc ${docCount}: [${category}]`);
        console.log(`  Subject: "${subject.substring(0, 60)}..."`);
        console.log(`  Categories: [${[category, ...subjectCategories].join(', ')}]`);
        console.log(`  Body: "${docText.substring(0, 60)}..."\n`);
      }
      
      if (docCount % 1000 === 0) {
        console.log(`Processed ${docCount} documents...`);
      }
    });
    
    processDocuments();
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err.message);
  });

function processDocuments() {
  console.log(`\nTotal documents loaded: ${docCount}\n`);
    
    if (docCount === 0) {
      console.error('No documents loaded! Check CSV format (needs: text, category)');
      process.exit(1);
    }
    
    // Category statistics (flatten multi-categories)
    const categoryCounts = {};
    Object.values(allDocCategories).forEach(cats => {
      cats.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    });
    
    const uniqueCategories = Object.keys(categoryCounts).length;
    console.log('Category Statistics:');
    console.log('-------------------');
    console.log(`Total unique categories: ${uniqueCategories} out of 20 newsgroups`);
    console.log('Top categories:');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} documents`);
      });
    console.log();
    
    console.log('Building vocabulary and clustering...\n');
    
    // Calculate multi-label purity: % of document pairs sharing at least one category
    const calculatePurity = (docKeys) => {
      if (docKeys.length < 2) return 100;
      
      let pairsFromSameCategory = 0;
      let totalPairs = 0;
      
      for (let i = 0; i < docKeys.length; i++) {
        for (let j = i + 1; j < docKeys.length; j++) {
          totalPairs++;
          const catsI = allDocCategories[docKeys[i]];
          const catsJ = allDocCategories[docKeys[j]];
          if (catsI && catsJ) {
            // Check if they share ANY category
            const hasSharedCategory = catsI.some(cat => catsJ.includes(cat));
            if (hasSharedCategory) {
              pairsFromSameCategory++;
            }
          }
        }
      }
      
      return totalPairs > 0 ? (pairsFromSameCategory / totalPairs * 100) : 100;
    };
    
    // Calculate single-label purity: % of document pairs from same primary newsgroup
    const calculateSingleLabelPurity = (docKeys) => {
      if (docKeys.length < 2) return 100;
      
      let pairsFromSameCategory = 0;
      let totalPairs = 0;
      
      for (let i = 0; i < docKeys.length; i++) {
        for (let j = i + 1; j < docKeys.length; j++) {
          totalPairs++;
          const catI = primaryCategories[docKeys[i]];
          const catJ = primaryCategories[docKeys[j]];
          if (catI && catJ && catI === catJ) {
            pairsFromSameCategory++;
          }
        }
      }
      
      return totalPairs > 0 ? (pairsFromSameCategory / totalPairs * 100) : 100;
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
    
    // Cluster analysis with purity
    const clusters = clusterer.getClusters();
    let totalMultiLabelPurity = 0;
    let totalSingleLabelPurity = 0;
    
    clusters.forEach((cluster, idx) => {
      console.log(`Cluster ${idx} (${cluster.length} documents):`);
      
      if (cluster.length > 0) {
        // Extract document keys directly
        const docKeys = cluster.map(doc => doc.key).filter(k => k && k.startsWith('doc_'));
        
        // Calculate purity using keys (both multi-label and single-label)
        const multiLabelPurity = calculatePurity(docKeys);
        const singleLabelPurity = calculateSingleLabelPurity(docKeys);
        totalMultiLabelPurity += multiLabelPurity;
        totalSingleLabelPurity += singleLabelPurity;
        
        // Category distribution (flatten multi-categories)
        const catDist = {};
        docKeys.forEach(key => {
          const cats = allDocCategories[key];
          if (cats) {
            cats.forEach(cat => {
              catDist[cat] = (catDist[cat] || 0) + 1;
            });
          }
        });
        
        console.log(`  Multi-Label Purity: ${multiLabelPurity.toFixed(1)}% (pairs sharing ≥1 category)`);
        console.log(`  Single-Label Purity: ${singleLabelPurity.toFixed(1)}% (pairs from same newsgroup)`);
        console.log(`  Top categories:`);
        Object.entries(catDist)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .forEach(([cat, count]) => {
            console.log(`    ${cat}: ${count}`);
          });
        
        console.log(`  Sample documents:`);
        docKeys.slice(0, 2).forEach(key => {
          const cats = allDocCategories[key];
          console.log(`    [${cats.join(', ')}]`);
        });
      }
      console.log();
    });
    
    // Overall purity - both metrics
    const overallMultiLabelPurity = clusters.length > 0 ? totalMultiLabelPurity / clusters.length : 0;
    const overallSingleLabelPurity = clusters.length > 0 ? totalSingleLabelPurity / clusters.length : 0;
    console.log(`Overall Multi-Label Purity: ${overallMultiLabelPurity.toFixed(1)}%`);
    console.log('  (% of document pairs within clusters sharing at least one category)');
    console.log(`\nOverall Single-Label Purity: ${overallSingleLabelPurity.toFixed(1)}%`);
    console.log('  (% of document pairs within clusters from same primary newsgroup)\n');
    
    console.log('Comparison:');
    console.log(`  Improvement from multi-label: ${(overallMultiLabelPurity - overallSingleLabelPurity).toFixed(1)} percentage points\n`);
    console.log('Note: Newsgroups typically shows lower purity than BBC News because:');
    console.log('  - 20 distinct categories vs BBC\'s natural topic groupings');
    console.log('  - Similar categories (comp.graphics, comp.windows.x, comp.sys.*) overlap');
    
    // Top terms per cluster
    console.log('Top 10 Terms by Cluster:');
    const clusterTerms = clusterer.getClusterTerms(10);
    clusterTerms.forEach((terms, idx) => {
      console.log(`\nCluster ${idx}:`);
      terms.forEach(({ term, score }) => {
        console.log(`  ${term}: ${score.toFixed(4)}`);
      });
    });
}
