


exports.dedup = function(token) {
    return token.replace(/([^c])\1/g, '$1');
};

exports.dropInitialLetters = function(token) {
    if(token.match(/^(kn|gn|pn|ae|wr)/))
        return token.substr(1, token.length - 1);
        
    return token;
};