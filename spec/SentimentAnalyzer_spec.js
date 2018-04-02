/*
  Copyright (c) 2018, Hugo W.L. ter Doest

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

var stemmer = require('../lib/natural/stemmers/porter_stemmer');
var Analyzer = require("../lib/natural/sentiment/SentimentAnalyzer");
var testConfigurations = [
  {
    "language": "Basque",
    "stemmer": "",
    "vocabularyType": "senticon",
    "testSentences": [
      {"sentence": "2018ko martxoaren 30ean, Baionako Etxepare Lizeoko ikasleek Axut !-en, Artedrama eta Le Petit Théâtre de Pain antzerki taldeen \"Zazpi senideko\" obra berria ikusteko parada izanen dute. Aitzineko bi egunetan ere, hainbat tailerretan parte hartzeko parada ukanen dute. Sorkuntza laguntzeaz gain, Euskal kultur erakundeak lizeoan iraganen diren mediazio tailer batzuk sustatzen ditu.", "score": 0.014705882352941176},
      {"sentence": "Xiberuan, beste antzerki mota bat bada, kanpoan kantatzen eta dantzatzen dena: maskarada. Dantza ikusgarria eta \"predikua\" uztartzen dituen ihauterietako besta bat da. Xiberutarrak bizitzeko kostaldera joatearekin gelditu baldin baziren ere, berriki berriz bizi-bizi hasi dira, tradizioa eta modernismoa nahasten jakin duten tokiko jendeei esker.", "score": 0.01490909090909091},
      {"sentence": "Luzaz talde amateurrak bakarrik izan ondoan, orain profesionalak ere agertu dira. Hautatzen dituzten testuak euskal idazleenak ala egokipenak dira (Brecht, Réza, Koltès...).", "score": -0.011363636363636364},
      {"sentence": "Euskaldunok gure kulturarekiko erakutsi dugun maitasunari esker, ohiturazko dantza errepertorio aberats eta ikusgarria gorde dugu, eta gizarte aldaketei egokitu ahal izateko bere burua berritzen asmatu du.", "score": -0.012},
      {"sentence": "Uda zoragarri bat igaro nahi duzu Donostian, Euskal Herriko hiririk ederrenetako batean? Euskal Herriko Unibertsitatea liderra da euskal unibertsitate sisteman, eta aukera ematen dizu \"Basque Culture II. International Summer School\" ikastaro erakargarrian parte hartzeko 2017ko uztailaren 3tik 14ra. Ikastaroa mundu osoan izen handia duten profesionalek emango dute, eta akademikoki aukera paregabea da euskal gizartea gertutik ezagutzeko eta aldi berean hemengo hizkuntza eta ohiturak ikasteko.", "score": 0.00390625}
    ]
  },
  {
    "language": "Catalan",
    "stemmer": "",
    "vocabularyType": "senticon",
    "testSentences": [
      {"sentence": "Un total de 18 entitats catalanes entre empreses, festivals, institucions i un programa de ràdio especialitzat en jazz participaran amb l’estand català a Jazzahead!, la fira internacional de jazz que tindrà lloc del 19 al 22 d’abril a Bremen, Alemanya. La presència catalana a Bremen es concentrarà a l’estand del Departament de Cultura, organitzat per l’Institut Català de les Empreses Culturals (ICEC), sota la seva marca d’internacionalització, Catalan Arts - Music, que oferirà una imatge conjunta del sector i servirà als professionals com a punt de trobada i de negoci on desenvolupar les seves activitats a la fira amb les màximes facilitats. A més, amb l’objectiu de fomentar el networking entre els professionals catalans i els delegats internacionals acreditats a la fira, s’oferirà una recepció a l’estand català divendres 20 a les 18:00h.", "score": 0.009398496240601503},
      {"sentence": "La setmana passada parlàvem del projecte cinematogràfic de Pep Puig, 40 hectàrees. La terra i el pagès, format per deu peces audiovisuals de quinze minuts accessibles a Penedès Televisió. Pep Puig el resumeix en tres grans aspectes. El primer: ‘Parlen els pagesos. Els pagesos ben poques vegades ocupen un paper protagonista quan ens referim a la vinya i el vi. Aquest poc protagonisme pagès, segurament el podríem fer extensiu també als pagesos que treballen els altres conreus. El relat sempre ve dels elaboradors, dels enòlegs, dels publicistes. Mai, o quasi mai, dels pagesos. També, quan es parla del camp o del món rural, la interpretació que se’n fa ve donada majoritàriament des de la ciutat.’", "score": 0.006521739130434782},
      {"sentence": "El premi Nobel de Literatura Bob Dylan ha actuat aquesta nit al gran teatre del Liceu de Barcelona, on ha presentat el darrer àlbum, Triplicate, un disc triple en què repassa trenta grans peces de la música nord-americana del segle XX. Tot i que Dylan s’ha limitat a tocar i no ha fet cap discurs, havent acabat el concert, el públic ha cridat a favor de l’alliberament dels presos polítics catalans de les butaques del Liceu estant. Vegeu-ne ací el moment:", "score": 0.009950617283950617},
      {"sentence": "Les mones que fa Rosselló a la pastisseria, Pa i Dolços Rosselló, són elaborades amb farina, mantega, sucre i ous. Les corona amb un ou dur i, en algunes ocasions, amb un de xocolata. ‘Per fer-la atractiva per als xiquets, això que fem de vegades és donar alguna forma divertida a la massa. Les més habituals són d’animals: tortugues, granotes, cocodrils…’ explica Rosselló. Perquè la mona, que tradicionalment regalen els padrins, és important que sigui atractiva per als fillols, i això ha fet que, sobretot al Principat, depengui molt de les modes del moment.", "score": 0.004180851063829787},
      {"sentence": "El manifest ha estat escrit a sis mans. L’han redactat els historiadors Manuel Loff i Fernando Rosas i el politòleg André Freire. El signen, entre més, Alfredo Barroso, fundador del Partit socialista i ex-cap de la Casa civil, un òrgan d’assessorament polític, durant la presidència de Mário Soares; André Silva, diputat de Persones-Animals-Natura; Ascenso Simões, Isabel Moreira, Maria da Luz Rosinha i Tiago Barbosa Ribeiro, diputats socialistes; Joana Mortágua, José Soeiro, Luís Monteiro i Mariana Mortágua, diputats del Bloc d’esquerres; Ulisses Pereira, diputat socialdemòcrata i Rui Sá, membre de l’Assemblea Municipal de Porto de la Coalició Democràtica Unitària.", "score": -0.002551020408163265}
    ]
  },
  {
    "language": "Dutch",
    "stemmer": "",
    "vocabularyType": "pattern",
    "testSentences": [
        {"sentence": "Zo wordt het verhaal in een grappig sausje gerold, maar niet té grappig. De rondreis door Europa was leuk, hoewel Amsterdam wel erg cliché overkwam. Maar dit is misschien ook wel hoe toeristen het beleven, dat kan heel goed. Connie blijft het hele verhaal wat op de achtergrond waardoor we meer over haar in het verleden leren, dan over hoe ze nu is. Hun relatiegeschiedenis wordt in stukjes en beetjes verteld en daaruit merk je hoeveel Douglas van Connie houdt, en hoe onwaarschijnlijk het is dat ze uit elkaar zullen gaan. Als personage in de huidige tijd telt Connie minder mee dan Albie, de zoon. De relatie tussen vader en zoon wordt dus eigenlijk meer uitgediept dan die tussen man en vrouw. Maar vooral is het een boek waarin een man van middelbare leeftijd zichzelf leert kennen.", "score": 0.010218978102189781},
        {"sentence": "Wat Het Diner toch de moeite waard maakt is het spel van Jacob Derwig. Deze Derwig bewijst zich een ‘natural’, een acteur die met slechts een verveelde blik de camera weet te veroveren. Er is maar één term voor dergelijk charisma: filmster. En nee, dat indrukwekkende spel is niet te danken is aan Meyes’ acteursregie, want alle andere rollen zijn tenenkrommend. Dus. Laten ze die 20 miljoen aan Derwig geven, zodat hij kan verkassen naar Hollywood om daar in de remake te stralen. Kan ie doen wat Meyes had willen doen en wat Van Gogh had moeten doen. Ontsnappen aan onze schouderklopjes.", "score": 0.008823529411764706},
        {"sentence": "Als vrouwenfilms voor mutsenfilms uitgemaakt kunnen worden is Jackie er zeker een. Maar ‘mutsenfilm’ is natuurlijk gewoon een eufemisme voor ‘slechte film’. Gelukkig kent, zoals iedere slechte film, ook Jackie één geweldig moment. Als de gezusters Van Houten voorin de camper luidkeels meezingen met de denderende soundtrack, zonder te acteren, zonder te mutsen, zonder leuk te doen, vangen we een glimp op van de meiden waar Jackie eigenlijk over had moeten gaan. En die waren bij zo’n mutsenfilm allang opgestapt.", "score": 0.04125 },
        {"sentence": "En het is maar helemaal de vraag of de jeugd van tegenwoordig zich laat inpakken door hoofdrolspeelster Zoe Saldana. Overtuigend als ze was als blauwe alien in Avatar, live is deze spriet, hoe lenig door haar balletachtergrond ook en hoe streng kijkend-want-getraumatiseerd ook, bepaald niet een sexy killer van het kaliber Angelina Jolie in Salt. Ze heeft iets freakerigs, mede omdat ze stunts moet uithalen die zoveel acrobatie en slangemenselijkheid vereisen dat ze uit een Mission: Impossible geschrapt zouden zijn. Misschien dat ze meer tot haar recht komt als Besson zich gaat vergrijpen aan een game over een killer alien die in de steegjes van Bogota zoveel mogelijk kartelleden moet platrijden.", "score": -0.010810810810810813},
        {"sentence": "De tweede helft van de film is minder meeslepend omdat de plot dan uitgewerkt moet worden met vermoeiende actie. En ja, het is dan ook delivery time, niet Abrahams sterkste punt. Verder moet Spielberg zo nodig tranen afdwingen met onder meer een medaillon van een dooie (lees: heilige) moeder. Maar deze film is niet gemaakt voor Abrahams pizza of Spielbergs complex. Dit is genieten van een dik jongetje dat om de haverklap 'production value!' roept als hij iets ziet wat voor zijn film gebruikt kan worden, of het nu een treinramp is of een militaire bezetting. Super 8 is een ode aan de jeugd van twee filmmakers die nooit volwassen hebben willen geworden en daar met recht trots op zijn.", "score": 0.009166666666666667}
     ]
  }/*,
  {
    "language": "English",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "French",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "Galician",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "Italian",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  },
  {
    "language": "Spanish",
    "stemmer": "",
    "vocabularyType": "",
    "testSentences": []
  }*/

];

describe("The sentiment analyzer analyzes the sentiment of sentences in multiple languages using different types of vocabularies", function() {
  testConfigurations.forEach(config => {
    it("Should analyze a set of sentences with each configuration " + config, function() {
      var stemmer = null;
      // Create the stemmer
      if (config.stemmer != "") {
        stemmer = require(config.stemmer);
      }
      // Create analyzer
      var analyzer = new Analyzer(config.language, stemmer, config.vocabularyType);
      config.testSentences.forEach(sentencePlusScore => {
        var words = sentencePlusScore.sentence.split(/\s+/);
        var score = analyzer.getSentiment(words);
        expect(score).toEqual(sentencePlusScore.score);
        if (score != sentencePlusScore.score) {
          console.log(sentencePlusScore.sentence + "\t" + score);
        }
      });
    });
  });
});
