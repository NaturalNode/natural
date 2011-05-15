

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

// step 11
exports.transformQ = function(token) {
    return token.replace(/q/, 'k');
};

// step 12
exports.transformS = function(token) {
    return token.replace(/s(h|io|ia)/, 'x$1');
};

// step 13
exports.transformT = function(token) {
    token = token.replace(/t(ia|io)/, 'x$1');
    token = token.replace(/th/, '0');
    
    return token;
};

exports.dropT = function(token) {
    return token.replace(/tch/g, 'ch');
};

// step 14
exports.transformV = function(token) {
    return token.replace(/v/g, 'f');
};

// step 15
exports.transformWH = function(token) {
    return token.replace(/^wh/, 'w');
};

exports.dropW = function(token) {
    return token.replace(/w([^aeiou]|$)/, '$1');
};

// step 16
exports.transformX = function(token) {
    token = token.replace(/^x/, 's');
    token = token.replace(/x/g, 'ks');
    return token;
};

// step 17
exports.dropY = function(token) {
    return token.replace(/y([^aeiou]|$)/g, '$1');
};

// step 18
exports.transformZ = function(token) {
    return token.replace(/z/, 's');
};

// step 19
exports.dropVowels = function(token) {
    return token.replace(/(.)[aeiou]/g, '$1');
};

