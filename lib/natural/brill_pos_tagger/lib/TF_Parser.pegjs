{
  var TransformationRule = require("./TransformationRule");
}

transformation_rules = rules: (S transformation_rule S) +
{
  var result = [];

  for (var i = 0; i < rules.length; i++) {
    result.push(rules[i][1]);
  }
  return(result);
}

transformation_rule = c1: category1 c2: category2 pred: predicate par1: parameter par2: parameter ?
{
  // Construct rule
  var result = new TransformationRule(c1, c2, pred, par1, par2);
  return(result);
}

category1 = wild_card / identifier

category2 = identifier

predicate = identifier

parameter = identifier

identifier =
  characters: [a-zA-Z_0-9_\-\.,()]+ S_no_eol
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