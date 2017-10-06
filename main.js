// var natural = require('./lib/natural/');
// var Stemmer = natural.StemmerId;
// //var lowercaseText = "ketika malaikat-malaikat  Cinta + cinta  + bertasbih";
// //var tokens = PorterStemmer.tokenizeAndStem(lowercaseText);
// var text = "malaikat-malaikat"
// //console.log(PorterStemmer.isPlural(text));
// console.log(Stemmer.tokenizeAndStem("malaikat ku tak bersayap"));
// console.log(Stemmer.a("berkilah"));

var Removal = require("./lib/natural/stemmers/indonesian/removal");
var SuffixRules = require("./lib/natural/stemmers/indonesian/suffix_rules");
sr = new SuffixRules();
ts = sr.RemoveInflectionalParticle("biarkanlah");
console.log(ts.current_word);
console.log(ts.removal.getOriginalWord());
console.log(ts.removal.getResult());
console.log(ts.removal.getRemovedPart());
console.log(ts.removal.getAffixType());
// TESTCASES
var testcases = ["mei","bui","nilai","hancurlah","benarkah","apatah","siapapun","jubahku","bajumu","celananya","hantui","belikan","jualan","bukumukah","miliknyalah","kulitkupun","berikanku","sakitimu","beriannya","kasihilah","dibuang","kesakitan","sesuap","beradu","berambut","bersuara","berdaerah","belajar","bekerja","beternak","terasing","teraup","tergerak","terpuruk","teterbang","melipat","meringkas","mewarnai","meyakinkan","membangun","memfitnah","memvonis","memperbarui","mempelajari","meminum","memukul","mencinta","mendua","menjauh","menziarah","menuklir","menangkap","menggila","menghajar","mengqasar","mengudara","mengupas","menyuarakan","mempopulerkan","pewarna","peyoga","peradilan","perumahan","permuka","perdaerah","pembangun","pemfitnah","pemvonis","peminum","pemukul","pencinta","pendahulu","penjarah","penziarah","penasihat","penangkap","penggila","penghajar","pengqasar","pengudara","pengupas","penyuara","pelajar","pelabuhan","petarung","terpercaya","pekerja","peserta","mempengaruhi","mengkritik","bersekolah","bertahan","mencapai","dimulai","petani","terabai","mensyaratkan","mensyukuri","mengebom","mempromosikan","memproteksi","memprediksi","pengkajian","pengebom","bersembunyi","bersembunyilah","pelanggan","pelaku","pelangganmukah","pelakunyalah","perbaikan","kebaikannya","bisikan","menerangi","berimanlah","memuaskan","berpelanggan","bermakanan","menyala","menyanyikan","menyatakannya","penyanyi","penyawaan","rerata","lelembut","lemigas","kinerja","buku-buku","berbalas-balasan","bolak-balik","bertebaran","terasingkan","membangunkan","mencintai","menduakan","menjauhi","menggilai","pembangunan","marwan","subarkah","memberdayakan","persemakmuran","keberuntunganmu","kesepersepuluhnya","siapakah memberdayakan pembangunan","Perekonomian","menahan","Cinta telah bertebaran.Keduanya saling mencintai.","(Cinta telah bertebaran)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  Keduanya saling mencintai.","peranan","memberikan","medannya","idealis","idealisme","finalisasi","penstabilan","pentranskripsi","mentaati","meniru-nirukan","menyepak-nyepak","melewati","menganga","kupukul","kauhajar","kuasa-Mu","malaikat-malaikat-Nya","nikmat-Ku","allah-lah"];
/*for(var i in testcases){
	console.log(testcases[i]);
}*/