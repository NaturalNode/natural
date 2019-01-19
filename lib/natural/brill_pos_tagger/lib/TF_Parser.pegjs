{
  var TransformationRule = require("./TransformationRule");
}

transformation_rule = c1: category1 c2: category2 pred: predicate pars: parameter *
{
  var result = null;

  // Construct rule
  if (pars.length === 1) {
    result = new TransformationRule(c1, c2, pred, pars[0]);
  }
  else {
    if (pars.length === 2) {
      result = new TransformationRule(c1, c2, pred, pars[0], pars[1]);
    }
    else {
      result = new TransformationRule(c1, c2, pred);
    }
  }
  return(result);
}

category1 = wild_card / identifier

category2 = identifier

predicate = identifier

parameter = identifier

identifier =
//  characters: [a-zA-Z_0-9_\-\.,()]+ S_no_eol
// https://en.wikipedia.org/wiki/List_of_Unicode_characters
// Ranges supported: U+0021	- U+007E plus U+00A1 - U+00FF
  characters: [!-~¡-ÿ]+ S_no_eol
  {
   var s = "";
   for (var i = 0; i < characters.length; i++) {
     s += characters[i];
   }
   return(s);
  }

wild_card = wc: "*" S_no_eol
  {
   return(wc)
  }

// Blanks
EOL =
  '\r\n' / '\n' / '\r'
Comment =
  "\/\/" (!EOL .)* (EOL/EOI)
S =
  (' ' / '\t' / EOL / Comment)*
S_no_eol =
  (' ' / '\t' / Comment)*
EOI=
  !.
