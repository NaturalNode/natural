var natural = require('./lib/natural/');
var Stemmer = natural.StemmerId;
// data = []

// data.push(['mei', 'mei'])
// data.push(['bui', 'bui'])

// data.push(['nilai', 'nilai'])

// data.push(['hancurlah', 'hancur'])
// data.push(['benarkah', 'benar'])
// data.push(['apatah', 'apa'])
// data.push(['siapapun', 'siapa'])

// data.push(['jubahku', 'jubah'])
// data.push(['bajumu', 'baju'])
// data.push(['celananya', 'celana'])
// data.push(['hantui', 'hantu'])
// data.push(['belikan', 'beli'])
// data.push(['jualan', 'jual'])
// data.push(['bukumukah', 'buku']) 
// data.push(['miliknyalah', 'milik'])
// data.push(['kulitkupun', 'kulit']) 
// data.push(['berikanku', 'beri'])
// data.push(['sakitimu', 'sakit'])
// data.push(['beriannya', 'beri'])
// data.push(['kasihilah', 'kasih'])

// str_output = "";
// for(var i in data){
// 	sentence = data[i][0];
// 	output   = Stemmer.stem(sentence);
// 	str_output += output + " - ";
// }
	
// console.log(str_output);

console.log(Stemmer.a("terasing").current_word);

// FULL TESTCASES
// var testcases = ["mei","bui","nilai","hancurlah","benarkah","apatah","siapapun","jubahku","bajumu","celananya","hantui","belikan","jualan","bukumukah","miliknyalah","kulitkupun","berikanku","sakitimu","beriannya","kasihilah","dibuang","kesakitan","sesuap","beradu","berambut","bersuara","berdaerah","belajar","bekerja","beternak","terasing","teraup","tergerak","terpuruk","teterbang","melipat","meringkas","mewarnai","meyakinkan","membangun","memfitnah","memvonis","memperbarui","mempelajari","meminum","memukul","mencinta","mendua","menjauh","menziarah","menuklir","menangkap","menggila","menghajar","mengqasar","mengudara","mengupas","menyuarakan","mempopulerkan","pewarna","peyoga","peradilan","perumahan","permuka","perdaerah","pembangun","pemfitnah","pemvonis","peminum","pemukul","pencinta","pendahulu","penjarah","penziarah","penasihat","penangkap","penggila","penghajar","pengqasar","pengudara","pengupas","penyuara","pelajar","pelabuhan","petarung","terpercaya","pekerja","peserta","mempengaruhi","mengkritik","bersekolah","bertahan","mencapai","dimulai","petani","terabai","mensyaratkan","mensyukuri","mengebom","mempromosikan","memproteksi","memprediksi","pengkajian","pengebom","bersembunyi","bersembunyilah","pelanggan","pelaku","pelangganmukah","pelakunyalah","perbaikan","kebaikannya","bisikan","menerangi","berimanlah","memuaskan","berpelanggan","bermakanan","menyala","menyanyikan","menyatakannya","penyanyi","penyawaan","rerata","lelembut","lemigas","kinerja","buku-buku","berbalas-balasan","bolak-balik","bertebaran","terasingkan","membangunkan","mencintai","menduakan","menjauhi","menggilai","pembangunan","marwan","subarkah","memberdayakan","persemakmuran","keberuntunganmu","kesepersepuluhnya","siapakah memberdayakan pembangunan","Perekonomian","menahan","Cinta telah bertebaran.Keduanya saling mencintai.","(Cinta telah bertebaran)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  Keduanya saling mencintai.","peranan","memberikan","medannya","idealis","idealisme","finalisasi","penstabilan","pentranskripsi","mentaati","meniru-nirukan","menyepak-nyepak","melewati","menganga","kupukul","kauhajar","kuasa-Mu","malaikat-malaikat-Nya","nikmat-Ku","allah-lah"];
/*for(var i in testcases){
	console.log(testcases[i]);
}*/