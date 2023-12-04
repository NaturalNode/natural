/*
 Copyright (c) 2012, Guillaume Marty

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

/**
 * A noun inflector for French.
 * Compiled from:
 * \@see http://fr.wiktionary.org/wiki/Annexe:Pluriels_irr%C3%A9guliers_en_fran%C3%A7ais
 * \@see http://fr.wikipedia.org/wiki/Pluriels_irr%C3%A9guliers_en_fran%C3%A7ais
 *
 * \@todo Take compounded noun into account (eaux-fortes, pique-nique...).
 * \@todo General note: French also requires AdjectiveInflector (femininize...).
 */

const SingularPluralInflector = require('../singular_plural_inflector')
const FormSet = require('../form_set')

class NounInflector extends SingularPluralInflector {
  constructor () {
    super()
    // Ambiguous a.k.a. invariant.
    // \@todo Expand this list to be as comprehensive as possible.
    this.ambiguous = [
      // Nouns ending by -s
      'à-peu-près', 'à-propos', 'abattis', 'abcès', 'abois', 'abribus', 'abus',
      'accès', 'acquis', 'adénovirus', 'adonis', 'ados', 'agrès', 'aguets',
      'ailleurs', 'ais', 'albatros', 'albinos', 'alias', 'aloès', 'amaryllis',
      'amas', 'ampélopsis', 'ananas', 'anchois', 'angélus', 'anis', 'anticorps',
      'antihéros', 'antirides', 'anus', 'appas', 'appentis', 'appui-bras',
      'appuie-bras', 'arcanes', 'argus', 'arrérages', 'arrière-pays', 'as',
      'ascaris', 'asparagus', 'atlas', 'atours', 'aurochs', 'autobus',
      'autofocus', 'avant-bras', 'avant-corps', 'avant-propos', 'avers', 'avis',
      'axis', 'barbouillis', 'bas', 'beaujolais', 'beaux-arts', 'biais',
      'bibliobus', 'biceps', 'bicross', 'bien-fonds', 'bloc-notes', 'blockhaus',
      'blocus', 'blues', 'bois', 'bonus', 'bout-dehors', 'bouts-rimés',
      'branle-bas', 'bras', 'brebis', 'bris', 'brise-lames', 'brise-mottes',
      'brûlis', 'buis', 'burnous', 'bus', 'business', 'cabas', 'cacatoès',
      'cacatois', 'cactus', 'cadenas', 'cafouillis', 'caillebotis', 'calvados',
      'cambouis', 'campus', 'canevas', 'cannabis', 'carquois', 'cas',
      'casse-noisettes', 'casse-pieds', 'cassis', 'caucus', 'cens', 'cervelas',
      'chablis', 'chamois', 'chaos', 'chas', 'chasselas', 'châssis',
      'chatouillis', 'chauffe-assiettes', 'chauve-souris', 'chorus', 'choucas',
      'circoncis', 'cirrus', 'clafoutis', 'clapotis', 'cliquetis', 'clos',
      'cochylis', 'colis', 'coloris', 'commis', 'compas', 'compromis',
      'compte-chèques', 'compte-gouttes', 'compte-tours', 'concours', 'confins',
      'congrès', 'consensus', 'contrepoids', 'contresens', 'contretemps',
      'corn flakes', 'corps', 'corps-à-corps', 'corpus', 'cosinus', 'cosmos',
      'coulis', 'coupe-ongles', 'cours', 'court-jus', 'couscous', 'coutelas',
      'crocus', 'croquis', 'cross', 'cubitus', 'cumulus', 'cure-dents',
      'cure-ongles', 'cure-pipes', 'cursus', 'cyclo-cross', 'cyprès', 'dais',
      'damas', 'débarras', 'débours', 'débris', 'décès', 'dedans', 'dehors',
      'delirium tremens', 'demi-gros', 'dépens', 'dessous', 'dessus', 'détritus',
      'deux-mâts', 'deux-pièces', 'deux-points', 'deux-roues', 'deux-temps',
      'dévers', 'devis', 'diplodocus', 'discours', 'dos', 'ébats', 'éboulis',
      'échalas', 'edelweiss', 'élaeis', 'éleis', 'éléphantiasis', 'embarras',
      'empois', 'en-cas', 'encens', 'enclos', 'endos', 'engrais', 'entrelacs',
      'entremets', 'envers', 'épluche-légumes', 'ers', 'espace-temps',
      'essuie-mains', 'eucalyptus', 'ex-libris', 'excès', 'express', 'extrados',
      'faciès', 'fait-divers', 'fatras', 'faux-sens', 'favoris', 'ficus',
      'fier-à-bras', 'finnois', 'florès', 'focus', 'fœtus', 'fois', 'forceps',
      'fouillis', 'fracas', 'frais', 'français', 'franglais', 'frimas',
      'friselis', 'frisottis', 'froncis', 'frottis', 'fucus', 'gâchis', 'galetas',
      'galimatias', 'garde-à-vous', 'garde-corps', 'gargouillis', 'gars',
      'gâte-bois', 'gazouillis', 'génois', 'gibus', 'glacis', 'glas', 'gneiss',
      'gobe-mouches', 'grès', 'gribouillis', 'guet-apens', 'habeas corpus',
      'hachis', 'haras', 'hardes', 'harnais', 'haut-le-corps', 'hautbois',
      'herbe-aux-chats', 'héros', 'herpès', 'hiatus', 'hibiscus', 'hors-concours',
      'hors-pistes', 'hourdis', 'huis-clos', 'humérus', 'humus', 'ibis', 'iléus',
      'indique-fuites', 'infarctus', 'inlandsis', 'insuccès', 'intercours',
      'intrados', 'intrus', 'iris', 'isatis', 'jais', 'jars', 'jeans',
      'jeuconcours', 'judas', 'juliénas', 'jus', 'justaucorps', 'kakatoès',
      'kermès', 'kriss', 'lacis', 'laïus', 'lambris', 'lapis', 'laps', 'lapsus',
      'laquais', 'las', 'lattis', 'lave-mains', 'lavis', 'lèche-bottes',
      'lèche-vitrines', 'legs', 'lias', 'liégeois', 'lilas', 'lis', 'lœss',
      'logis', 'loris', 'lotus', 'louis', 'lupus', 'lys', 'mâchicoulis', 'madras',
      'maïs', 'malappris', 'malus', 'mânes', 'maquis', 'marais', 'maroilles',
      'marquis', 'mas', 'mass-médias', 'matelas', 'matois', 'médius', 'mépris',
      'mérinos', 'mess', 'mets', 'mi-bas', 'micro-ondes', 'mille-pattes',
      'millepertuis', 'minibus', 'minois', 'minus', 'mirabilis', 'mois',
      'monocorps', 'monte-plats', 'mors', 'motocross', 'mots-croisés', 'motus',
      'mouchetis', 'mucus', 'myosotis', 'nævus', 'négus', 'niais',
      'nimbo-stratus', 'nimbus', 'norois', 'nounours', 'nu-pieds', 'oasis',
      'obus', 'olibrius', 'omnibus', 'opus', 'os', 'ours', 'ouvre-boîtes',
      'ouvre-bouteilles', 'palais', 'palis', 'palmarès', 'palus', 'panais',
      'panaris', 'pancréas', 'papyrus', 'par-dehors', 'paradis', 'parcours',
      'pardessus', 'pare-balles', 'pare-chocs', 'parvis', 'pas', 'passe-temps',
      'pataquès', 'pathos', 'patois', 'pavois', 'pays', 'permis',
      'petit-bourgeois', 'petit-gris', 'petit-pois', 'phallus', 'phimosis',
      'pickles', 'pilotis', 'pique-fleurs', 'pis', 'pithiviers', 'pityriasis',
      'plateau-repas', 'plâtras', 'plein-temps', 'plexiglas', 'plexus', 'plus',
      'poids', 'pois', 'pont-levis', 'porte-avions', 'porte-bagages',
      'porte-billets', 'porte-bouteilles', 'porte-clés', 'porte-hélicoptères',
      'porte-jarretelles', 'porte-revues', 'pouls', 'préavis', 'presse-fruits',
      'presse-papiers', 'princeps', 'printemps', 'procès', 'processus', 'progrès',
      'propos', 'prospectus', 'protège-dents', 'psoriasis', 'pubis', 'puits',
      'pus', 'putois', 'quatre-épices', 'quatre-feuilles', 'quatre-heures',
      'quatre-mâts', 'quatre-quarts', 'quatre-temps', 'quitus', 'rabais',
      'rachis', 'radis', 'radius', 'raïs', 'ramassis', 'rébus', 'reclus',
      'recours', 'refus', 'relais', 'remords', 'remous', 'remue-méninges',
      'rendez-vous', 'repas', 'répons', 'repos', 'repris', 'reps', 'rétrovirus',
      'revers', 'rhinocéros', 'rictus', 'rince-doigts', 'ris', 'rollmops',
      'rosé-des-prés', 'roulis', 'rubis', 'salmigondis', 'salsifis', 'sans-logis',
      'sas', 'sassafras', 'sauternes', 'schnaps', 'schuss', 'secours', 'semis',
      'sens', 'serre-fils', 'serre-livres', 'sévices', 'sinus', 'skunks',
      'souris', 'sournois', 'sous-bois', 'stradivarius', 'stras', 'strass',
      'strato-cumulus', 'stratus', 'stress', 'succès', 'surdos', 'surplus',
      'surpoids', 'sursis', 'suspens', 'synopsis', 'syphilis', 'taffetas',
      'taillis', 'talus', 'tamaris', 'tamis', 'tapis', 'tas', 'taudis', 'temps',
      'tennis', 'terminus', 'terre-neuvas', 'tétanos', 'tétras', 'thalamus',
      'thermos', 'thesaurus', 'thésaurus', 'thymus', 'tire-fesses', 'tonus',
      'torchis', 'torticolis', 'tournedos', 'tournevis', 'tournis', 'tracas',
      'traîne-savates', 'travers', 'tréfonds', 'treillis', 'trépas', 'trias',
      'triceps', 'trichomonas', 'trois-étoiles', 'trois-mâts', 'trois-quarts',
      'trolleybus', 'tumulus', 'typhus', 'univers', 'us', 'utérus', 'vasistas',
      'vélocross', 'velours', 'verglas', 'verjus', 'vernis', 'vers',
      'vert-de-gris', 'vide-ordures', 'vide-poches', 'villageois', 'virus',
      'vis-à-vis', 'volubilis', 'vulgum pecus', 'waters', 'williams', 'xérès',

      // Nouns ending by -x
      'abat-voix', 'afflux', 'alpax', 'anthrax', 'apex', 'aptéryx',
      'archéoptéryx', 'arrière-faix', 'bombyx', 'borax', 'bordeaux', 'bouseux',
      'box', 'carex', 'casse-noix', 'cedex', 'céphalothorax', 'cérambyx', 'chaux',
      'choix', 'coccyx', 'codex', 'contumax', 'coqueleux', 'cortex', 'courroux',
      'croix', 'crucifix', 'culex', 'demodex', 'duplex', 'entre-deux', 'époux',
      'équivaux', 'eux', 'ex', 'faix', 'faucheux', 'faux', 'fax', 'ferreux',
      'flux', 'fox', 'freux', 'furax', 'hapax', 'harengueux', 'hélix',
      'horse-pox', 'houx', 'index', 'influx', 'inox', 'juke-box', 'kleenex',
      'lagothrix', 'larynx', 'lastex', 'latex', 'lux', 'lynx', 'macareux', 'max',
      'mésothorax', 'mi-voix', 'mirepoix', 'motteux', 'multiplex', 'murex',
      'narthex', 'noix', 'onyx', 'opopanax', 'oropharynx', 'paix', 'panax',
      'perdrix', 'pharynx', 'phénix', 'phlox', 'phoenix', 'pneumothorax', 'poix',
      'portefaix', 'pousse-cailloux', 'preux', 'prix', 'prothorax', 'pucheux',
      'pyrex', 'pyroligneux', 'quadruplex', 'queux', 'redoux', 'reflex', 'reflux',
      'relax', 'rhinopharynx', 'rose-croix', 'rouvieux', 'roux', 'rumex',
      'saindoux', 'sardonyx', 'scolex', 'sèche-cheveux', 'silex', 'simplex',
      'sioux', 'sirex', 'smilax', 'solex', 'songe-creux', 'spalax', 'sphex',
      'sphinx', 'storax', 'strix', 'styrax', 'surfaix', 'surtaux', 'syrinx',
      'tamarix', 'taux', 'télex', 'thorax', 'tord-boyaux', 'toux', 'trionyx',
      'tripoux', 'tubifex', 'vertex', 'vidéotex', 'vielleux', 'vieux',
      'violoneux', 'voix', 'volvox', 'vortex',

      // Nouns ending by -z
      'allume-gaz', 'assez', 'biogaz', 'cache-nez', 'camping-gaz', 'chez',
      'chintz', 'ersatz', 'fez', 'free-jazz', 'fritz', 'gaz', 'gin-fizz', 'hertz',
      'jazz', 'jerez', 'kibboutz', 'kilohertz', 'kolkhoz', 'kronprinz', 'lapiaz',
      'lez', 'mégahertz', 'merguez', 'nez', 'pince-nez', 'quartz', 'quiz', 'ranz',
      'raz', 'recez', 'rémiz', 'rez', 'riz', 'ruolz', 'seltz', 'serre-nez'
    ]

    this.customPluralForms = []
    this.customSingularForms = []
    this.singularForms = new FormSet()
    this.pluralForms = new FormSet()

    // this.attach = attach

    this.addIrregular('ail', 'aulx')
    this.addIrregular('bétail', 'bestiaux')
    this.addIrregular('bonhomme', 'bonshommes')
    this.addIrregular('ciel', 'cieux')
    this.addIrregular('monsieur', 'messieurs')
    this.addIrregular('mafioso', 'mafiosi')
    this.addIrregular('œil', 'yeux')
    this.addIrregular('putto', 'putti')
    this.addIrregular('targui', 'touareg') // touareg -> touaregs is also OK.

    // Pluralize
    this.pluralForms.regularForms.push([/^(av|b|c|carnav|cérémoni|chac|corr|emment|emmenth|festiv|fut|gavi|gra|narv|p|récit|rég|rit|rorqu|st)al$/i, '$1als'])
    this.pluralForms.regularForms.push([/^(aspir|b|cor|ém|ferm|gemm|soupir|trav|vant|vent|vitr)ail$/i, '$1aux'])
    this.pluralForms.regularForms.push([/^(bij|caill|ch|gen|hib|jouj|p|rip|chouch)ou$/i, '$1oux'])
    this.pluralForms.regularForms.push([/^(gr|berimb|don|karb|land|pil|rest|sarr|un)au$/i, '$1aus'])
    this.pluralForms.regularForms.push([/^(bl|ém|enf|pn)eu$/i, '$1eus'])
    this.pluralForms.regularForms.push([/(au|eau|eu|œu)$/i, '$1x'])
    this.pluralForms.regularForms.push([/al$/i, 'aux'])
    this.pluralForms.regularForms.push([/(s|x)$/i, '$1'])
    this.pluralForms.regularForms.push([/(.*)$/i, '$1s'])

    // Singularize
    this.singularForms.regularForms.push([/^(aspir|b|cor|ém|ferm|gemm|soupir|trav|vant|vent|vitr)aux$/i, '$1ail'])
    this.singularForms.regularForms.push([/^(aloy|b|bouc|boy|burg|conoy|coy|cr|esquim|ét|fabli|flé|flûti|glu|gr|gru|hoy|joy|kérab|matéri|nobli|noy|pré|sen|sén|t|touch|tuss|tuy|v|ypré)aux$/i, '$1au'])
    this.singularForms.regularForms.push([/^(bij|caill|ch|gen|hib|jouj|p|rip|chouch)oux$/i, '$1ou'])
    this.singularForms.regularForms.push([/^(bis)?aïeux$/i, '$1aïeul'])
    this.singularForms.regularForms.push([/^apparaux$/i, 'appareil']) // One way transform, don't put on irregular list.
    this.singularForms.regularForms.push([/^ciels$/i, 'ciel'])
    this.singularForms.regularForms.push([/^œils$/i, 'œil'])
    this.singularForms.regularForms.push([/(eau|eu|œu)x$/i, '$1'])
    this.singularForms.regularForms.push([/aux$/i, 'al'])
    this.singularForms.regularForms.push([/(.*)s$/i, '$1'])

    this.pluralize = function (token) {
      return this.ize(token, this.pluralForms, this.customPluralForms)
    }

    this.singularize = function (token) {
      return this.ize(token, this.singularForms, this.customSingularForms)
    }
  }
}

module.exports = NounInflector
