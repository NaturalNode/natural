/*
Copyright (c) 2022,
Dylan R. E. Moonfire <https://github.com/dmoonfire>,
Emily Marigold Klassen <https://github.com/forivall>,
Hugo W.L. ter Doest <https://github.com/Hugo-ter-Doest>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

declare interface DataPtr {
  pointerSymbol: string
  synsetOffset: number
  pos: string
  sourceTarget: string
}

declare interface DataRecord {
  synsetOffset: number
  lexFilenum: number
  pos: string
  wCnt: number
  lemma: string
  synonyms: string[]
  lexId: string
  ptrs: DataPtr[]
  gloss: string
  def: string
  exp: string[]
}

declare type DataRecordCallback = (results: DataRecord) => void
declare type DataRecordsCallback = (results: DataRecord[]) => void

declare class DataFile {
  constructor (dataDir: string, name: string)
  get (location: number, callback: DataRecordCallback): void
}

declare interface IndexRecord {
  lemma: string
  pos: string
  ptrSymbol: string[]
  senseCnt: number
  tagsenseCnt: number
  synsetOffset: number[]
}

declare type IndexRecordCallback = (results: IndexRecord) => void

declare interface IndexFind {
  status: string
  key: string
  line: string
  tokens: string[]
}

declare type IndexFindCallback = (results: IndexFind) => void

declare class IndexFile {
  constructor (dataDir: string, name: string)
  lookup (word: string, callback: IndexRecordCallback): void
  lookupFromFile (word: string, callback: IndexRecordCallback): void
  find (word: string, callback: IndexFindCallback): void
}

declare interface WordNetLookupFile {
  index: IndexFile
  data: DataFile
}

export class WordNet {
  constructor (dataDir?: string)
  get (synsetOffset: number, pos: string, callback: DataRecordCallback): void
  lookup (word: string, callback: DataRecordsCallback): void
  lookupFromFiles (files: WordNetLookupFile[], results: DataRecord[], word: string, callback: DataRecordsCallback): void
  pushResults (data: DataFile, results: DataRecord[], offsets: number[], callback: DataRecordsCallback): void
  loadResultSynonyms (synonyms: DataRecord[], results: DataRecord[], callback: DataRecordsCallback): void
  loadSynonyms (synonyms: DataRecord[], results: DataRecord[], ptrs: DataPtr[], callback: DataRecordsCallback): void
  lookupSynonyms (word: string, callback: DataRecordsCallback): void
  getSynonyms (record: DataRecord, callback: DataRecordsCallback): void
  getDataFile (pos: string): DataFile
}
