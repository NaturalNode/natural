

// step 1
exports.dedup = function(token) {
    return token.replace(/([^c])\1/g, '$1');
};

// step 2
exports.dropInitialLetters = function(token) {
    if(token.match(/^(kn|gn|pn|ae|wr)/))
        return token.substr(1, token.length - 1);
        
    return token;
};

// step 3
exports.dropBafterMAtEnd = function(token) {
    return token.replace(/mb$/, 'm');
};

// step 4 
exports.cTransform = function(token) {
    token = token.replace(/([^s]|^)(c)(h)/g, '$1x$3').trim();
    token = token.replace(/cia/g, 'xia');
    token = token.replace(/c(i|e|y)/g, 's$1');
    token = token.replace(/c/g, 'k'); 
    
    return token;
};

// step 5
exports.dTransform = function(token) {
    token = token.replace(/d(ge|gy|gi)/g, 'j$1');
    token = token.replace(/d/g, 't');
    
    return token;
};

// step 6
exports.dropG = function(token) {
    token = token.replace(/gh(^$|[^aeiou])/g, 'h$1');
    token = token.replace(/g(n|ned)$/g, '$1');    
    
    return token;
};

// step 7
exports.transformG = function(token) {
    token = token.replace(/([^g]|^)(g)(i|e|y)/g, '$1j$3');
    token = token.replace(/gg/g, 'g');
    token = token.replace(/g/g, 'k');    
    
    return token;
};

// step 8
exports.dropH = function(token) {
    return token.replace(/([aeiou])h([^aeiou])/, '$1$2');
};

// step 9
exports.transformCK = function(token) {
    return token.replace(/ck/, 'k');
};

// step 10
exports.transformPH = function(token) {
    return token.replace(/ph/, 'f');
};

// step11
exports.transformQ = function(token) {
    return token.replace(/q/, 'k');
};
