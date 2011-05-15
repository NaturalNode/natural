

// step 1
function dedup(token) {
    return token.replace(/([^c])\1/g, '$1');
}

// step 2
function dropInitialLetters(token) {
    if(token.match(/^(kn|gn|pn|ae|wr)/))
        return token.substr(1, token.length - 1);
        
    return token;
}

// step 3
function dropBafterMAtEnd(token) {
    return token.replace(/mb$/, 'm');
}

// step 4 
function cTransform(token) {
    token = token.replace(/([^s]|^)(c)(h)/g, '$1x$3').trim();
    token = token.replace(/cia/g, 'xia');
    token = token.replace(/c(i|e|y)/g, 's$1');
    token = token.replace(/c/g, 'k'); 
    
    return token;
}

// step 5
function dTransform(token) {
    token = token.replace(/d(ge|gy|gi)/g, 'j$1');
    token = token.replace(/d/g, 't');
    
    return token;
}

// step 6
function dropG(token) {
    token = token.replace(/gh(^$|[^aeiou])/g, 'h$1');
    token = token.replace(/g(n|ned)$/g, '$1');    
    
    return token;
}

// step 7
function transformG(token) {
    token = token.replace(/([^g]|^)(g)(i|e|y)/g, '$1j$3');
    token = token.replace(/gg/g, 'g');
    token = token.replace(/g/g, 'k');    
    
    return token;
}

// step 8
function dropH(token) {
    return token.replace(/([aeiou])h([^aeiou])/, '$1$2');
}

// step 9
function transformCK(token) {
    return token.replace(/ck/, 'k');
}

// step 10
function transformPH(token) {
    return token.replace(/ph/, 'f');
}

// step 11
function transformQ(token) {
    return token.replace(/q/, 'k');
}

// step 12
function transformS(token) {
    return token.replace(/s(h|io|ia)/, 'x$1');
}

// step 13
function transformT(token) {
    token = token.replace(/t(ia|io)/, 'x$1');
    token = token.replace(/th/, '0');
    
    return token;
}

function dropT(token) {
    return token.replace(/tch/g, 'ch');
}

// step 14
function transformV(token) {
    return token.replace(/v/g, 'f');
}

// step 15
function transformWH(token) {
    return token.replace(/^wh/, 'w');
}

function dropW(token) {
    return token.replace(/w([^aeiou]|$)/, '$1');
}

// step 16
function transformX(token) {
    token = token.replace(/^x/, 's');
    token = token.replace(/x/g, 'ks');
    return token;
}

// step 17
function dropY(token) {
    return token.replace(/y([^aeiou]|$)/g, '$1');
}

// step 18
function transformZ(token) {
    return token.replace(/z/, 's');
}

// step 19
function dropVowels(token) {
    return token.replace(/(.)[aeiou]/g, '$1');
}

exports.dedup = dedup;
exports.dropInitialLetters = dropInitialLetters;
exports.dropBafterMAtEnd = dropBafterMAtEnd;
exports.cTransform = cTransform;
exports.dTransform = dTransform;
exports.dropG = dropG;
exports.transformG = transformG;
exports.dropH = dropH;
exports.transformCK = transformCK;
exports.transformPH = transformPH;
exports.transformQ = transformQ;
exports.transformS = transformS;
exports.transformT = transformT;
exports.dropT = dropT;
exports.transformV = transformV;
exports.transformWH = transformWH;
exports.dropW = dropW;
exports.transformX = transformX;
exports.dropY = dropY;
exports.transformZ = transformZ;
exports.dropVowels = dropVowels;
