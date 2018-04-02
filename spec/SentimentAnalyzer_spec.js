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

var natural = require("../lib/natural");
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
  },
  {
    "language": "English",
    "stemmer": "PorterStemmer",
    "vocabularyType": "afinn",
    "testSentences": [
      {"sentence": "So is Gemini a joke, you ask? You're never sure whether Andrew Reed's cinematography is straight borrowing from Michael Mann's cool-blue visuals from Heat or mocking the sort of Angelenos that would watch that heist film and see nothing but a decor schematic for every single interior. Or, for that matter, whether composer Keegan DeWitt's is parodying the sax-heavy scores of Skinemax thrillers past or simply copying one in between icy techno interludes. The fact that the performers, especially the exceptional Kirke, keep their tongues firmly planted in their cheeks helps ground things, as does the fact that the jabs are featherweight enough to pass as shrugs. It may feel insubstantial at times, but somewhere out there, there's a twin of this film that lays on the L.A. Self-Owns Itself mojo in thick clumps. Gemini is the good-sibling version. It's worth a whirl.", "score": -0.027972027972027972},
      {"sentence": "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.", "score": -0.10144927536231885},
      {"sentence": "But as soon as Vic decides to hit the road to Knoxville, his birthplace, sentiment infects the film like a virus. Writer-director Adam Rifkin clearly has affection for his star, but he's put him in a leaky vehicle that sinks way before the journey ends. Sam Elliott handled a similar role with more style, emotion and dramatic heft in last year's The Hero. But Reynolds, let's not forget, really is a movie star. And a great one. The pleasure of his company is still an exuberant gift. He deserves more than an opportunity missed.", "score": -0.06382978723404255},
      {"sentence": "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.", "score": -0.10144927536231885},
      {"sentence": "G-Eazy released his expansive third album, The Beautiful & Damned, in December with hit singles \"No Limit\" and \"Him & I.\" The album featured guest appearances from Cardi B, A$AP Rocky, Charlie Puth and Halsey, and debuted at Number Three on the Billboard 200.", "score": 0.06818181818181818}
    ]
  },
  {
    "language": "English",
    "stemmer": "PorterStemmer",
    "vocabularyType": "senticon",
    "testSentences": [
      {"sentence": "So is Gemini a joke, you ask? You're never sure whether Andrew Reed's cinematography is straight borrowing from Michael Mann's cool-blue visuals from Heat or mocking the sort of Angelenos that would watch that heist film and see nothing but a decor schematic for every single interior. Or, for that matter, whether composer Keegan DeWitt's is parodying the sax-heavy scores of Skinemax thrillers past or simply copying one in between icy techno interludes. The fact that the performers, especially the exceptional Kirke, keep their tongues firmly planted in their cheeks helps ground things, as does the fact that the jabs are featherweight enough to pass as shrugs. It may feel insubstantial at times, but somewhere out there, there's a twin of this film that lays on the L.A. Self-Owns Itself mojo in thick clumps. Gemini is the good-sibling version. It's worth a whirl.", "score": -0.02696503496503496},
      {"sentence": "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.", "score": 0.037159420289855076},
      {"sentence": "But as soon as Vic decides to hit the road to Knoxville, his birthplace, sentiment infects the film like a virus. Writer-director Adam Rifkin clearly has affection for his star, but he's put him in a leaky vehicle that sinks way before the journey ends. Sam Elliott handled a similar role with more style, emotion and dramatic heft in last year's The Hero. But Reynolds, let's not forget, really is a movie star. And a great one. The pleasure of his company is still an exuberant gift. He deserves more than an opportunity missed.", "score": 0.009042553191489356},
      {"sentence": "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.", "score": 0.037159420289855076},
      {"sentence": "G-Eazy released his expansive third album, The Beautiful & Damned, in December with hit singles \"No Limit\" and \"Him & I.\" The album featured guest appearances from Cardi B, A$AP Rocky, Charlie Puth and Halsey, and debuted at Number Three on the Billboard 200.", "score": 0.04025},
      
    ]
  },
  {
    "language": "English",
    "stemmer": "PorterStemmer",
    "vocabularyType": "pattern",
    "testSentences": [
      {"sentence": "So is Gemini a joke, you ask? You're never sure whether Andrew Reed's cinematography is straight borrowing from Michael Mann's cool-blue visuals from Heat or mocking the sort of Angelenos that would watch that heist film and see nothing but a decor schematic for every single interior. Or, for that matter, whether composer Keegan DeWitt's is parodying the sax-heavy scores of Skinemax thrillers past or simply copying one in between icy techno interludes. The fact that the performers, especially the exceptional Kirke, keep their tongues firmly planted in their cheeks helps ground things, as does the fact that the jabs are featherweight enough to pass as shrugs. It may feel insubstantial at times, but somewhere out there, there's a twin of this film that lays on the L.A. Self-Owns Itself mojo in thick clumps. Gemini is the good-sibling version. It's worth a whirl.", "score": -0.007692307692307693},
      {"sentence": "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.", "score": -0.010144927536231883},
      {"sentence": "But as soon as Vic decides to hit the road to Knoxville, his birthplace, sentiment infects the film like a virus. Writer-director Adam Rifkin clearly has affection for his star, but he's put him in a leaky vehicle that sinks way before the journey ends. Sam Elliott handled a similar role with more style, emotion and dramatic heft in last year's The Hero. But Reynolds, let's not forget, really is a movie star. And a great one. The pleasure of his company is still an exuberant gift. He deserves more than an opportunity missed.", "score": -0.026595744680851064},
      {"sentence": "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.", "score": -0.010144927536231883},
      {"sentence": "G-Eazy released his expansive third album, The Beautiful & Damned, in December with hit singles \"No Limit\" and \"Him & I.\" The album featured guest appearances from Cardi B, A$AP Rocky, Charlie Puth and Halsey, and debuted at Number Three on the Billboard 200.", "score": 0.022727272727272728}      
    ]
  },
  {
    "language": "French",
    "stemmer": "PorterStemmerFr",
    "vocabularyType": "pattern",
    "testSentences": [
      {"sentence": "La décision provoquait des réactions contrastées sur les réseaux sociaux, où certains rappelaient le mode d’action spectaculaire qui était la signature d’Act Up dans les années 1990 (préservatif géant sur l’obélisque de la Concorde à Paris, jets de faux sang ou de vraies cendres de militants…)", "score": 0.0021739130434782596},
      {"sentence": "« How’s your mug ? » Un simple tour de voix et c’est le rire assuré dans le public : la « Théière anglaise » Michel Sénéchal vient de s’adresser ce 29 février 2004 à la Tasse chinoise dans L’Enfant et les sortilèges de Ravel au Théâtre des Champs-Elysées. Le ténor français, que sa voix aux aigus faciles et bien projetés, son sens de la comédie et son irrésistible charisme avaient destiné aux « rôles » de caractère, cette aptitude à camper des personnages à la fois émouvants et ridicules, s’est éteint le 1er avril à l’âge de 91 ans à l’hôpital d’Eaubonne, dans le Val-d’Oise.", "score": 0.021132075471698115},
      {"sentence": "C’est vrai. Mais cela correspond vraiment à la conjonction de ma passion du cinéma et de la musique de film. Etant français, je pouvais m’identifier à ces deux compositeurs très lyriques, qui avaient écrit la musique de films majeurs pour de grands metteurs en scène, et qui étaient partis à Hollywood. J’avais une fascination pour la Californie. Ils réunissaient tous les rêves que je pouvais...", "score": 0.018923076923076924},
      {"sentence": "Après Scarlatti, Bach et Haendel dont il a joué les œuvres ou qui ont inspiré ses improvisations, le pianiste italien Enrico Pieranunzi rend hommage à Claude Debussy, dont on célèbre le centenaire de la mort. Complété par le batteur André Ceccarelli et le contrebassiste Diego Imbert, le trio forme l’ossature sur laquelle se greffent selon les morceaux la chanteuse italienne Simona Severini, entendue dans l’album du pianiste My Songbook (Via Veneto Jazz), ou le saxophoniste ténor David El Malek. Une configuration inhabituelle dans la discographie de Pieranunzi. Tour à tour alerte et virevoltant (Passepied, L’Autre Ballade, Cheveux), lâchant les chevaux (Blues for Claude, Mr. Golliwogg) ou tout en délicatesse (Nuit d’étoiles, Romance) jusqu’à ce moment de poésie qu’est L’Adieu, Enrico Pieranunzi et ses complices enchantent. Paul Benkimoun", "score": 0.009291338582677165},
      {"sentence": "A la fin de l’année 2017, Spotify comptait 159 millions d’utilisateurs actifs, dont 58 millions en Europe, contre 52 millions en Amérique du Nord. Ce chiffre est presque le double de celui de son plus proche concurrent, Apple Music, comme indiqué dans son rapport auprès de la Securities and Exchange Commission (SEC), l’autorité de surveillance des marchés américains.Le marché européen des introductions a été robuste l’année dernière, avec une valeur totale de 43,9 milliards d’euros", "score": -0.001733333333333333}
    ]
  },
  {
    "language": "Galician",
    "stemmer": "",
    "vocabularyType": "senticon",
    "testSentences": []
  },
  {
    "language": "Italian",
    "stemmer": "PorterStemmerIt",
    "vocabularyType": "pattern",
    "testSentences": [
      {"sentence": "Merito del film, è quello di provare a fornire allo spettatore una visione ampia e obiettiva sui motivi dell'odio, facendo parlare le persone, oltre che le immagini. Nonostante le fiamme, destinate ad aumentare fin dall'incipit, divampino furiosamente. Come nella scena dell'impiccagione, quando un uomo di colore viene appeso a un albero mentre la sua casa brucia alle spalle. E una voce extradiegetica intona una preghiera triste e piena di rabbia.", "score": 0.004428571428571428}, 
      {"sentence": "Apparso di sbieco solo in un paio di sceneggiati tv, Karl Marx entra qui in scena, per la prima volta da protagonista, nel film di Raoul Peck, con il volto e il corpo di August Diehl. Un interprete in parte ma sopra le righe, a volte troppo compiaciuto, che tuttavia serve a perfezione l'obiettivo: rappresentare Marx come uomo prima che come filosofo, come artista prima che come teorico, raccontarlo arrabbiato, innamorato, umiliato, ubriaco, come fosse una persona normale.", "score": -0.0016666666666666668}, 
      {"sentence": "Mario Cavallaro non è un uomo cattivo; è fondamentalmente un uomo solo che ha fatto del non cambiamento uno scudo protettivo che si costella di aculei quando si trova davanti coloro che finiscono con il tentare, con il loro modo di vivere, non di distruggerlo ma solo di scalfirlo. Come tanti di noi risponde in modo infastidito alle richieste di oboli o acquisti di vario genere che gli vengono avanzate da venditori ambulanti che hanno la pelle di un colore diverso dal suo. Non sa che in Africa si dice che \"chiedere non è rubare\" ma sperimenta solo l'insistenza nella richiesta che può fare la differenza.", "score": 0.010754716981132074}, 
      {"sentence": "Teen-movie sentimentale e notturno, gravato da una malattia genetica ereditaria che predispone all'insorgenza di carcinomi, Il sole a mezzanotte - Midnight Sun fa il suo lavoro e lo fa bene, esplorando l'abbagliamento del primo amore e applicando senza cadute i codici del genere: il montaggio spensierato a colpi di baci sotto le stelle, sotto i capelli sciolti e le lune piene, dentro bagni lunari e contro ostacoli drammatici che riconducono al duro principio di realtà. Diretto da Scott Speer, il romantic-drama di Katie e Charlie elude l'overdose e il côté sciropposo, le trappole della disgrazia e quelle della compassione, seguendo un'educazione sentimentale piena e fatale che ha voglia di vivere al di là delle difficoltà incontrate o imposte dalla sorte. Lui ha le spalle larghe (da nuotatore) e la mascella serrata, lei un candore verginale e una dolcezza risplendente più del sole che la uccide.", "score": -0.0010344827586206884},
      {"sentence": "Scritto per se stessa molto bene, il personaggio di Maria ha il pregio di una grazia non comune che naturalmente collide con il caos endogeno di una Roma sempre più degradata, anche umanamente. La donna mostra gentilezza ed empatia verso tutti, specie verso gli emarginati che sanno di verità e contrastano con il vuoto del jet set cinematografico romacentrico: il contrasto mai retorico non fa che aumentare lo spessore della protagonista. Scritto senza banalità, con notevole ironia (alcuni siparietti sono veramente irresistibili) e girato con garbo, il film resta tuttavia sulla linea della premessa che non della riuscita nel momento in cui non sembra mai veramente decollare. I sentieri narrativi abbozzati sono interessanti ma appaiono ancorati a un sommerso che stenta ad evolversi. L'auspicio è che lo sguardo indubbiamente sensibile di Karen Di Porto possa presto posarsi su un plot più sofisticato e ambizioso.", "score": 0.024097222222222225}
    ]
  },
  {
    "language": "Spanish",
    "stemmer": "PorterStemmerEs",
    "vocabularyType": "afinn",
    "testSentences": [
      {"sentence": "Pues, en efecto, es solo el plano y lo que muestra aquello que interesa a Zemeckis. Y también aquello que, finalmente, acaba evocando una cierta fantasmagoría que está detrás de muchas de las películas del cineasta, ese espacio entre las cosas que se dedica a atisbar desde su cámara, o desde el avión de El vuelo, o desde la isla de Náufrago, el aire y el agua, o simplemente la presencia imponente de las Torres Gemelas que aquí se transforma poco a poco en ausencia inquietante, mezcla de pasado y presente, hasta el punto de que El desafío podría ser también una película política. ¿Estamos ya en condiciones de equiparar todo lo dicho con el metraje encontrado de Forrest Gump, al fin y al cabo otra celebración de ese espacio inmaterial, de ese tiempo suspendido que es la Historia? ", "score": 0.05},
      {"sentence": "En este sentido, El insulto, una de las cintas nominadas al Oscar a la Mejor película de habla no inglesa en los pasados Premios de la Academia, también subraya lo rápido que olvidamos los traumas de nuestra historia reciente, sepultados por los distintos discursos e ideologías agitadoras del odio. Tal vez Doueiri haya simplificado un conflicto complejo, pero los estereotipos que aparecen en El insulto explican bastante bien cómo funcionamos cuando la rabia nos corroe.", "score": 0.04},
      {"sentence": "Su actriz principal es una niña, y sus compañeras de reparto bailan como lo harían las dos amigas de La boda de mi mejor amiga. La pátina irónica de la propuesta no impide que Dumont elabore el lirismo del texto y la belleza del paisaje. Jeannette es una película con los pies en la tierra y con la mirada hacia el cielo, una película que parte de lo físico (epicentro del cine de Dumont) para elevarse hacia la espiritualidad.", "score": 0.012658227848101266},
      {"sentence": "El poco miedo a parecer estúpida, por otra parte, hace de esta incursión en las debilidades masculinas un retrato divertido a la par que honesto, e incluso cuando se sitúa en espacios más frívolos sabe encontrar los resortes adecuados para hacer que del chiste broten risas ácidas.", "score": 0.02127659574468085},
      {"sentence": "Hay imágenes en Ready Player One realmente ingeniosas, así como set pieces abrumadores (que mejor no desvelar para no estropear el visionado); aunque el conglomerado de citas no siempre acaba funcionando, y la mezcla, por tanto, se transforma en mezcolanza: en un abigarrado fresco de todas esas cosas que han molado en los últimos 40 años, apelotonadas sin demasiado rigor ni pensamiento. Poca duda cabe de que Spielberg ha pulido mucho la literatura de Cline (es notorio en el último tramo del largometraje), pero aún y así el toque mágico del Rey Midas se resiente (algo), sobre todo cuando nos damos cuenta de que debajo de los adoquines, esa pátina espectacular de píxeles destellantes, no está escondida la playa. Ni nada que se le parezca.", "score": 0.008}
    ]
  },
  {
    "language": "Spanish",
    "stemmer": "PorterStemmerEs",
    "vocabularyType": "senticon",
    "testSentences": [
      {"sentence": "Pues, en efecto, es solo el plano y lo que muestra aquello que interesa a Zemeckis. Y también aquello que, finalmente, acaba evocando una cierta fantasmagoría que está detrás de muchas de las películas del cineasta, ese espacio entre las cosas que se dedica a atisbar desde su cámara, o desde el avión de El vuelo, o desde la isla de Náufrago, el aire y el agua, o simplemente la presencia imponente de las Torres Gemelas que aquí se transforma poco a poco en ausencia inquietante, mezcla de pasado y presente, hasta el punto de que El desafío podría ser también una película política. ¿Estamos ya en condiciones de equiparar todo lo dicho con el metraje encontrado de Forrest Gump, al fin y al cabo otra celebración de ese espacio inmaterial, de ese tiempo suspendido que es la Historia? ", "score": 0.007957142857142857},
      {"sentence": "En este sentido, El insulto, una de las cintas nominadas al Oscar a la Mejor película de habla no inglesa en los pasados Premios de la Academia, también subraya lo rápido que olvidamos los traumas de nuestra historia reciente, sepultados por los distintos discursos e ideologías agitadoras del odio. Tal vez Doueiri haya simplificado un conflicto complejo, pero los estereotipos que aparecen en El insulto explican bastante bien cómo funcionamos cuando la rabia nos corroe.", "score": 0.0020133333333333327},
      {"sentence": "Su actriz principal es una niña, y sus compañeras de reparto bailan como lo harían las dos amigas de La boda de mi mejor amiga. La pátina irónica de la propuesta no impide que Dumont elabore el lirismo del texto y la belleza del paisaje. Jeannette es una película con los pies en la tierra y con la mirada hacia el cielo, una película que parte de lo físico (epicentro del cine de Dumont) para elevarse hacia la espiritualidad.", "score": 0.00511392405063291},
      {"sentence": "El poco miedo a parecer estúpida, por otra parte, hace de esta incursión en las debilidades masculinas un retrato divertido a la par que honesto, e incluso cuando se sitúa en espacios más frívolos sabe encontrar los resortes adecuados para hacer que del chiste broten risas ácidas.", "score": 0.00719148936170213},
      {"sentence": "Hay imágenes en Ready Player One realmente ingeniosas, así como set pieces abrumadores (que mejor no desvelar para no estropear el visionado); aunque el conglomerado de citas no siempre acaba funcionando, y la mezcla, por tanto, se transforma en mezcolanza: en un abigarrado fresco de todas esas cosas que han molado en los últimos 40 años, apelotonadas sin demasiado rigor ni pensamiento. Poca duda cabe de que Spielberg ha pulido mucho la literatura de Cline (es notorio en el último tramo del largometraje), pero aún y así el toque mágico del Rey Midas se resiente (algo), sobre todo cuando nos damos cuenta de que debajo de los adoquines, esa pátina espectacular de píxeles destellantes, no está escondida la playa. Ni nada que se le parezca.", "score": -0.00584}
    ]
  }

];

describe("The sentiment analyzer analyzes the sentiment of sentences in multiple languages using different types of vocabularies", function() {
  testConfigurations.forEach(config => {
    it("Should analyze a set of sentences with each configuration " + config, function() {
      var stemmer = null;
      // Create the stemmer
      if (config.stemmer != "") {
        stemmer = natural[config.stemmer];
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
