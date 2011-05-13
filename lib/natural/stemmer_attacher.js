
var stopwords = require('./stopwords');
require('./tokenizer').attach();

exports.attach = function(stemmer) {
    stemmer.attach = function() {
        String.prototype.stem = function() {
            return stemmer.stem(this);
        };
        
        String.prototype.tokenizeAndStem = function(keepStops) {
            var stemmedTokens = [];
            
            this.tokenize().forEach(function(token) {
                if(keepStops || stopwords.words.indexOf(token) == -1)
                    stemmedTokens.push(token.stem());
            });
            
            return stemmedTokens;
        }    
    }
}