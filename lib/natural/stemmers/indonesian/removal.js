function Removal (original_word, result, removedPart, affixType) {
    this.original_word 	= original_word;
    this.result 		= result;
    this.removedPart 	= removedPart
    this.affixType 		= affixType;
}
 
Removal.prototype.getOriginalWord = function() {
    return this.original_word;
};

Removal.prototype.getResult = function() {
    return this.result;
};

Removal.prototype.getRemovedPart = function() {
    return this.removedPart;
};

Removal.prototype.getAffixType = function() {
    return this.affixType;
};

module.exports = Removal;