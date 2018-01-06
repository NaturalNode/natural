/*
	THIS TEST REQUIRE CHAI AND MOCHA
	install chai --> npm install chai --save-dev
	install mocha --> npm install mocha -g
	to run --> mocha tests --watch
*/
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai

var natural = require('../lib/natural/');
var Stemmer = natural.StemmerId;

var data = []

// THE TESTCASES
// don't stem short words
data.push(['mei', 'mei'])
data.push(['bui', 'bui'])

// lookup up the dictionary, to prevent overstemming
// don't stem nilai to nila
data.push(['nilai', 'nilai'])

// lah|kah|tah|pun
data.push(['hancurlah', 'hancur'])
data.push(['benarkah', 'benar'])
data.push(['apatah', 'apa'])
data.push(['siapapun', 'siapa'])

// ku|mu|nya
data.push(['jubahku', 'jubah'])
data.push(['bajumu', 'baju'])
data.push(['celananya', 'celana'])

// i|kan|an
data.push(['hantui', 'hantu'])
data.push(['belikan', 'beli'])
data.push(['jualan', 'jual'])

// combination of suffixes
data.push(['bukumukah', 'buku']) //gagal karena -ku dianggap suffix dan dihilangkan
data.push(['miliknyalah', 'milik'])
data.push(['kulitkupun', 'kulit']) //gagal karena -ku dianggap suffix dan dihilangkan
data.push(['berikanku', 'beri'])
data.push(['sakitimu', 'sakit'])
data.push(['beriannya', 'beri'])
data.push(['kasihilah', 'kasih'])

// plain prefix
data.push(['dibuang', 'buang'])
data.push(['kesakitan', 'sakit'])
data.push(['sesuap', 'suap'])

//data.push(['teriakanmu', 'teriak']) // wtf? kok jadi ria?
//teriakanmu -> te-ria-kan-mu

// template formulas for derivation prefix rules (disambiguation) //

// rule 1a : berV -> ber-V
data.push(['beradu', 'adu'])

// rule 1b : berV -> be-rV
data.push(['berambut', 'rambut'])

// rule 2 : berCAP -> ber-CAP
data.push(['bersuara', 'suara'])

// rule 3 : berCAerV -> ber-CAerV where C != 'r'
data.push(['berdaerah', 'daerah'])

// rule 4 : belajar -> bel-ajar
data.push(['belajar', 'ajar'])

// rule 5 : beC1erC2 -> be-C1erC2 where C1 != {'r'|'l'}
data.push(['bekerja', 'kerja'])
data.push(['beternak', 'ternak'])

// rule 6a : terV -> ter-V
data.push(['terasing', 'asing'])

// rule 6b : terV -> te-rV
data.push(['teraup', 'raup'])

// rule 7 : terCerV -> ter-CerV where C != 'r'
data.push(['tergerak', 'gerak'])

// rule 8 : terCP -> ter-CP where C != 'r' and P != 'er'
data.push(['terpuruk', 'puruk'])

// rule 9 : teC1erC2 -> te-C1erC2 where C1 != 'r'
data.push(['teterbang', 'terbang'])

// rule 10 : me{l|r|w|y}V -> me-{l|r|w|y}V
data.push(['melipat', 'lipat'])
data.push(['meringkas', 'ringkas'])
data.push(['mewarnai', 'warna'])
data.push(['meyakinkan', 'yakin'])

// rule 11 : mem{b|f|v} -> mem-{b|f|v}
data.push(['membangun', 'bangun'])
data.push(['memfitnah', 'fitnah'])
data.push(['memvonis', 'vonis'])

// rule 12 : mempe{r|l} -> mem-pe
data.push(['memperbarui', 'baru'])
data.push(['mempelajari', 'ajar'])

// rule 13a : mem{rV|V} -> mem{rV|V}
data.push(['meminum', 'minum'])

// rule 13b : mem{rV|V} -> me-p{rV|V}
data.push(['memukul', 'pukul'])

// rule 14 : men{c|d|j|z} -> men-{c|d|j|z}
data.push(['mencinta', 'cinta'])
data.push(['mendua', 'dua'])
data.push(['menjauh', 'jauh'])
data.push(['menziarah', 'ziarah'])

// rule 15a : men{V} -> me-n{V}
data.push(['menuklir', 'nuklir'])

// rule 15b : men{V} -> me-t{V}
data.push(['menangkap', 'tangkap'])

// rule 16 : meng{g|h|q} -> meng-{g|h|q}
data.push(['menggila', 'gila'])
data.push(['menghajar', 'hajar'])
data.push(['mengqasar', 'qasar'])

// rule 17a : mengV -> meng-V
data.push(['mengudara', 'udara'])

// rule 17b : mengV -> meng-kV
data.push(['mengupas', 'kupas'])

// rule 18 : menyV -> meny-sV
data.push(['menyuarakan', 'suara'])

// rule 19 : mempV -> mem-pV where V != 'e'
data.push(['mempopulerkan', 'populer'])

// rule 20 : pe{w|y}V -> pe-{w|y}V
data.push(['pewarna', 'warna'])
data.push(['peyoga', 'yoga'])

// rule 21a : perV -> per-V
data.push(['peradilan', 'adil'])

// rule 21b : perV -> pe-rV
data.push(['perumahan', 'rumah'])

// rule 22 is missing in the document?

// rule 23 : perCAP -> per-CAP where C != 'r' and P != 'er'
data.push(['permuka', 'muka'])

// rule 24 : perCAerV -> per-CAerV where C != 'r'
data.push(['perdaerah', 'daerah'])

// rule 25 : pem{b|f|v} -> pem-{b|f|v}
data.push(['pembangun', 'bangun'])
data.push(['pemfitnah', 'fitnah'])
data.push(['pemvonis', 'vonis'])

// rule 26a : pem{rV|V} -> pe-m{rV|V}
data.push(['peminum', 'minum'])

// rule 26b : pem{rV|V} -> pe-p{rV|V}
data.push(['pemukul', 'pukul'])

// rule 27 : men{c|d|j|z} -> men-{c|d|j|z}
data.push(['pencinta', 'cinta'])
data.push(['pendahulu', 'dahulu'])
data.push(['penjarah', 'jarah'])
data.push(['penziarah', 'ziarah'])

// rule 28a : pen{V} -> pe-n{V}
data.push(['penasihat', 'nasihat'])

// rule 28b : pen{V} -> pe-t{V}
data.push(['penangkap', 'tangkap'])

// rule 29 : peng{g|h|q} -> peng-{g|h|q}
data.push(['penggila', 'gila'])
data.push(['penghajar', 'hajar'])
data.push(['pengqasar', 'qasar'])

// rule 30a : pengV -> peng-V
data.push(['pengudara', 'udara'])

// rule 30b : pengV -> peng-kV
data.push(['pengupas', 'kupas'])

// rule 31 : penyV -> peny-sV
data.push(['penyuara', 'suara'])

// rule 32 : pelV -> pe-lV except pelajar -> ajar
data.push(['pelajar', 'ajar'])
data.push(['pelabuhan', 'labuh'])

// rule 33 : peCerV -> per-erV where C != {r|w|y|l|m|n}
// TODO : find the examples

// rule 34 : peCP -> pe-CP where C != {r|w|y|l|m|n} and P != 'er'
data.push(['petarung', 'tarung'])

// CS additional rules

// rule 35 : terC1erC2 -> ter-C1erC2 where C1 != 'r'
data.push(['terpercaya', 'percaya'])

// rule 36 : peC1erC2 -> pe-C1erC2 where C1 != {r|w|y|l|m|n}
data.push(['pekerja', 'kerja'])
data.push(['peserta', 'serta'])

// CS modify rule 12
data.push(['mempengaruhi', 'pengaruh'])

// CS modify rule 16
data.push(['mengkritik', 'kritik'])

// CS adjusting rule precedence
data.push(['bersekolah', 'sekolah']) //gagal sekolah -> seko why?
data.push(['bertahan', 'tahan'])
data.push(['mencapai', 'capai']) //gagal mencapai -> capa
data.push(['dimulai', 'mulai'])
data.push(['petani', 'tani']) //gagal petani -> petan
data.push(['terabai', 'abai']) //gagal terabai -> aba

// ECS
data.push(['mensyaratkan', 'syarat'])
data.push(['mensyukuri', 'syukur'])
data.push(['mengebom', 'bom'])
data.push(['mempromosikan', 'promosi'])
data.push(['memproteksi', 'proteksi'])
data.push(['memprediksi', 'prediksi'])
data.push(['pengkajian', 'kaji'])
data.push(['pengebom', 'bom'])

// ECS loop pengembalian akhiran
data.push(['bersembunyi', 'sembunyi'])
data.push(['bersembunyilah', 'sembunyi'])
data.push(['pelanggan', 'langgan'])
data.push(['pelaku', 'laku'])
data.push(['pelangganmukah', 'langgan'])
data.push(['pelakunyalah', 'laku'])

data.push(['perbaikan', 'baik'])
data.push(['kebaikannya', 'baik'])
data.push(['bisikan', 'bisik'])
data.push(['menerangi', 'terang'])
data.push(['berimanlah', 'iman'])

data.push(['memuaskan', 'puas'])
data.push(['berpelanggan', 'langgan'])
data.push(['bermakanan', 'makan'])

// CC (Modified ECS)
data.push(['menyala', 'nyala'])
data.push(['menyanyikan', 'nyanyi'])
data.push(['menyatakannya', 'nyata'])

data.push(['penyanyi', 'nyanyi'])
data.push(['penyawaan', 'nyawa'])

// CC infix
data.push(['rerata', 'rata'])
data.push(['lelembut', 'lembut'])
data.push(['lemigas', 'ligas'])
data.push(['kinerja', 'kerja'])

// plurals
data.push(['buku-buku', 'buku'])
data.push(['berbalas-balasan', 'balas'])
data.push(['bolak-balik', 'bolak-balik'])

// combination of prefix + suffix
data.push(['bertebaran', 'tebar'])
data.push(['terasingkan', 'asing'])
data.push(['membangunkan', 'bangun'])
data.push(['mencintai', 'cinta'])
data.push(['menduakan', 'dua'])
data.push(['menjauhi', 'jauh'])
data.push(['menggilai', 'gila'])
data.push(['pembangunan', 'bangun'])

// return the word if not found in the dictionary
data.push(['marwan', 'marwan'])
data.push(['subarkah', 'subarkah'])

// recursively remove prefix
data.push(['memberdayakan', 'daya'])
data.push(['persemakmuran', 'makmur'])
data.push(['keberuntunganmu', 'untung'])
data.push(['kesepersepuluhnya', 'sepuluh'])

// test stem sentence
data.push(['siapakah memberdayakan pembangunan', 'siapa daya bangun'])

// issues
data.push(['Perekonomian', 'ekonomi'])
data.push(['menahan', 'tahan'])

// test stem multiple sentences
multipleSentence1 = 'Cinta telah bertebaran.Keduanya saling mencintai.';
multipleSentence2 = "(Cinta telah bertebaran)\n\n\n\nKeduanya saling mencintai.";
data.push([multipleSentence1, 'cinta telah tebar dua saling cinta'])
data.push([multipleSentence2, 'cinta telah tebar dua saling cinta'])

// failed on other method / algorithm but we should succeed
data.push(['peranan', 'peran'])
data.push(['memberikan', 'beri'])
data.push(['medannya', 'medan'])

// TODO:
//data.push(['sebagai', 'bagai'])
//data.push(['bagian', 'bagian'])
//data.push(['berbadan', 'badan'])
//data.push(['abdullah', 'abdullah'])

// adopted foreign suffixes
//data.push(['budayawan', 'budaya'])
//data.push(['karyawati', 'karya'])
data.push(['idealis', 'ideal'])
data.push(['idealisme', 'ideal'])
data.push(['finalisasi', 'final'])

// sastrawi additional rules
data.push(['penstabilan', 'stabil'])
data.push(['pentranskripsi', 'transkripsi'])

data.push(['mentaati', 'taat'])
data.push(['meniru-nirukan', 'tiru'])
data.push(['menyepak-nyepak', 'sepak'])

data.push(['melewati', 'lewat'])
data.push(['menganga', 'nganga'])

data.push(['kupukul', 'pukul'])
data.push(['kauhajar', 'hajar'])

data.push(['kuasa-Mu', 'kuasa'])
data.push(['malaikat-malaikat-Nya', 'malaikat'])
data.push(['nikmat-Ku', 'nikmat'])
data.push(['allah-lah', 'allah'])


function mochaSyncTest(data, i){
	it("Stemming " + data[i][0] + " to " + data[i][1] , function() {
		var output   = Stemmer.tokenizeAndStem(data[i][0]);
		output = output.join(" ");
		console.log(output);
		expect(output).to.equal(data[i][1]);
	});
}
for(var i in data){
	describe("tryStem-" + i, function() {
	  	mochaSyncTest(data, i);
	});	
}