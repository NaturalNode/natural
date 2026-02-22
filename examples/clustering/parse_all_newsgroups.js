/**
 * Batch Parser for 20 Newsgroups Dataset
 * Converts all newsgroup files into a combined CSV
 * 
 * Usage: node parse_all_newsgroups.js <input_dir> <output_csv>
 * Example: node parse_all_newsgroups.js examples/clustering/data/20_newsgroups combined_newsgroups.csv
 * 
 * Format: Each message has:
 *   Newsgroup: alt.atheism
 *   document_id: 49960
 *   From: user@example.com
 *   Subject: Message Subject
 *   [other headers]
 *   
 *   Message body text...
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function parseNewsgroup(inputFile) {
  const documents = [];
  let messageCount = 0;

  const fileStream = fs.createReadStream(inputFile, { highWaterMark: 64 * 1024 });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentMessage = null;
  let inMessageBody = false;
  let bodyLines = [];

  for await (const line of rl) {
    // Detect start of new message (Newsgroup: header)
    if (line.startsWith('Newsgroup:')) {
      // Save previous message if exists
      if (currentMessage && bodyLines.length > 0) {
        const body = bodyLines.join(' ').replace(/\s+/g, ' ').trim();
        if (body.length > 100) {
          currentMessage.text = body;
          documents.push(currentMessage);
          messageCount++;
        }
      }

      // Start new message
      const newsgroup = line.substring(10).trim();
      currentMessage = { newsgroup, document_id: null, from: '', subject: '' };
      bodyLines = [];
      inMessageBody = false;
    }
    else if (line.startsWith('document_id:') && currentMessage) {
      currentMessage.document_id = line.substring(12).trim();
    }
    else if (line.startsWith('From:') && currentMessage) {
      currentMessage.from = line.substring(5).trim();
    }
    else if (line.startsWith('Subject:') && currentMessage) {
      currentMessage.subject = line.substring(8).trim();
    }
    else if (currentMessage && line.trim() === '' && !inMessageBody) {
      // Empty line marks start of body
      inMessageBody = true;
    }
    else if (currentMessage && inMessageBody) {
      // Accumulate body lines
      if (line.trim().length > 0) {
        bodyLines.push(line.trim());
      }
    }
  }

  // Save final message
  if (currentMessage && bodyLines.length > 0) {
    const body = bodyLines.join(' ').replace(/\s+/g, ' ').trim();
    if (body.length > 100) {
      currentMessage.text = body;
      documents.push(currentMessage);
      messageCount++;
    }
  }

  return documents;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node parse_all_newsgroups.js <input_dir> <output_csv>');
    console.error('Example: node parse_all_newsgroups.js examples/clustering/data/20_newsgroups combined_newsgroups.csv');
    process.exit(1);
  }

  const inputDir = args[0];
  const outputFile = args[1];

  if (!fs.existsSync(inputDir)) {
    console.error(`Error: Directory not found: ${inputDir}`);
    process.exit(1);
  }

  // Find all .txt files
  const files = fs.readdirSync(inputDir)
    .filter(file => file.endsWith('.txt'))
    .map(file => path.join(inputDir, file));

  if (files.length === 0) {
    console.error(`No .txt files found in ${inputDir}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} newsgroup files\n`);

  // Parse all files
  let totalDocuments = 0;
  const allDocuments = [];

  for (const file of files) {
    console.log(`Parsing ${path.basename(file)}...`);
    const docs = await parseNewsgroup(file);
    allDocuments.push(...docs);
    totalDocuments += docs.length;
    console.log(`  ✓ ${docs.length} messages\n`);
  }

  // Write combined CSV
  console.log(`\nWriting ${totalDocuments} documents to ${outputFile}...`);
  const csvStream = fs.createWriteStream(outputFile);
  csvStream.write('text,category,document_id,from,subject\n');

  allDocuments.forEach(doc => {
    const escapedText = `"${doc.text.replace(/"/g, '""')}"`;
    const escapedSubject = `"${doc.subject.replace(/"/g, '""')}"`;
    const escapedFrom = `"${doc.from.replace(/"/g, '""')}"`;
    csvStream.write(`${escapedText},${doc.newsgroup},${doc.document_id},${escapedFrom},${escapedSubject}\n`);
  });

  return new Promise((resolve) => {
    csvStream.end();
    csvStream.on('finish', () => {
      console.log(`✓ Complete!\n`);
      console.log(`Summary:`);
      console.log(`  Total documents: ${totalDocuments}`);
      console.log(`  Total files parsed: ${files.length}`);
      console.log(`  Output size: ${(require('fs').statSync(outputFile).size / (1024*1024)).toFixed(1)} MB`);
      console.log(`  Output file: ${outputFile}`);
      resolve();
    });
  });
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
