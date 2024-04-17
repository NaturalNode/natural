const fs = require('fs');
const path = require('path');

function countTests(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const itRegex = /it\((.*?)\)/g;
  const describeRegex = /describe\((.*?)\)/g;
  const expectRegex = /expect\((.*?)\)/g;
  const itCount = (fileContent.match(itRegex) || []).length;
  const describeCount = (fileContent.match(describeRegex) || []).length;
  const expectCount = (fileContent.match(expectRegex) || []).length;
  return expectCount;
}

function countTestsInSpecFiles (specFilesPath, extension) {
  const specFiles = fs.readdirSync(specFilesPath);
  const testCounts = {};

  specFiles.forEach(file => {
    const filePath = path.join(specFilesPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && path.extname(file) === extension) {
      const parsedPath = path.parse(file);
      const filenameWithoutExtension = parsedPath.name;
      const testCount = countTests(filePath);
      testCounts[filenameWithoutExtension] = testCount;
    }
  });
  return testCounts;
}

let specFilesPath = path.resolve(__dirname, '..');
console.log(specFilesPath);
const testCountsJs = countTestsInSpecFiles(specFilesPath, '.js');
console.log(testCountsJs);

specFilesPath = path.resolve(__dirname, '../../ts_spec');
console.log(specFilesPath);
const testCountsTs = countTestsInSpecFiles(specFilesPath, '.ts');
console.log(testCountsTs);


console.log(Object.keys(testCountsJs).length === Object.keys(testCountsTs).length);

Object.keys(testCountsJs).forEach(file => {
  if (testCountsJs[file] !== testCountsTs[file]) {
    console.log(file, testCountsJs[file], testCountsTs[file]);
  }
})