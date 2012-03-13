/*
Copyright (c) 2011, Chris Umbel and Russell Mull

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

var sqlite3 = require('sqlite3'),
  _ = require('underscore'),
  url = require('url');

function downloadFile(url, filePath, callback) {
    var zlib;
    
    zlib = require('zlib');
    var http = require('http');
    
    var req = http.get({
	host: url.host,
	path: url.path,
	port: 80
    });
    
    req.on('response', function (response) {
	var fileStream = fs.createWriteStream(filePath);
	response.on('end', function () {
	    fileStream.end();
	    callback();
	});
	response.pipe(zlib.createGunzip()).pipe(fileStream);
    });
    return;
}

module.exports = function(dbInfo) {
  var db = null;

  if( dbInfo instanceof sqlite3.Database) {
    db = dbInfo;
  } else {
    db = new sqlite3.Database(dbInfo, sqlite3.OPEN_READONLY);
  }

  /**
   * Return a function which which looks up words using the given 
   * query field, which should be qualified by table name. (e.g. 
   * words.wordid) Will use LIKE for the task if useLikeOperator
   * is true, otherwise will query on equality. 
   */
  var findWordsBy = function(queryField, useLikeOperator)
  {
    var sql = "SELECT synsets.*, senses.*, words.* " +
              "FROM synsets " + 
              "INNER JOIN senses ON synsets.synsetid = senses.synsetid " +
              "INNER JOIN words  ON senses.wordid = words.wordid ";
   
    if(useLikeOperator) {
      sql += "WHERE " + queryField + " LIKE ?";
    } else {
      sql += "WHERE " + queryField + " = ?";
    }
    
    return function(queryValue, callback) {
      db.all(sql, [queryValue], function(err, rows) {
        var words = _.chain(rows).
                      groupBy('wordid').values().
                      map( function(rows) { return new Word(rows); } ).
                      value();

        callback(words);
      });
    }
  }

  /**
   * Create a getter for a single wordGet a single word, using the same 
   * parameter semantics as findWordsBy
   */
  var getWordBy = function(queryField, useLikeOperator)
  {
    return function(queryValue, callback)
    {
      findWordsBy(queryField)(queryValue, function(words) {
        if(words.length < 1) {
          callback(null);
        } else {
          callback(words[0]);
        }
      });
    }
  }

  var Word = function(rows)
  {
    return {
      id: rows[0].wordid, 
      lemma: rows[0].lemma, 

      senses: _.map(rows, function(row) {
        return {
          pos: row.pos, 
          definition: row.definition,
          synsetId: row.synsetid,
          getSynonyms: function(callback) {
            findWordsBy('synsets.synsetid', false)(this.synsetId, callback);
          }
        };
      })
    };

  }

  return {
    getWord:      getWordBy('words.lemma', true),
    getWordById:  getWordBy('words.wordid', false),
    findWords:    findWordsBy('words.lemma', true)
  };
};
