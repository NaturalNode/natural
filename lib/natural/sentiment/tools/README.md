# Tools
This folder contains some tools for manipulating vocabularies for the sentiment analyzer.

## `sentimentXmlParser`
Transforms ML-Senticon XML files into JSON files. The JSON file contains a vocabulary that maps words to objects as follows:
```javascript
"admirable": {
  "pos": "a",
  "pol": "1.0",
  "std": "0.0"
}
```
Property `pol` is the sentiment of the word.

## `XmlParser4PatternData`
Transforms vocabularies of the [Pattern project](https://www.clips.uantwerpen.be/pages/pattern) to JSON files. The JSON file contains a vocabulary that maps wordt to objects:
```javascript
  "aanraden": {
    "form": "aanraden",
    "cornetto_id": "",
    "cornetto_synset_id": "",
    "wordnet_id": "",
    "pos": "VB",
    "sense": "",
    "polarity": "0.2",
    "subjectivity": "0.0",
    "intensity": "1.0",
    "confidence": "0.9"
  }
```
Property `polarity` is the sentiment of the word.
