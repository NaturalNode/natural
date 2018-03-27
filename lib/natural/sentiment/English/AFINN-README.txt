AFINN is a list of English words rated for valence with an integer
between minus five (negative) and plus five (positive). The words have
been manually labeled by Finn Årup Nielsen in 2009-2011. The file
is tab-separated. There are two versions:

AFINN-111: Newest version with 2477 words and phrases.

AFINN-96: 1468 unique words and phrases on 1480 lines. Note that there
are 1480 lines, as some words are listed twice. The word list in not
entirely in alphabetic ordering.  

An evaluation of the word list is available in:

Finn Årup Nielsen, "A new ANEW: Evaluation of a word list for
sentiment analysis in microblogs", http://arxiv.org/abs/1103.2903

The list was used in: 

Lars Kai Hansen, Adam Arvidsson, Finn Årup Nielsen, Elanor Colleoni,
Michael Etter, "Good Friends, Bad News - Affect and Virality in
Twitter", The 2011 International Workshop on Social Computing,
Network, and Services (SocialComNet 2011).


This database of words is copyright protected and distributed under
"Open Database License (ODbL) v1.0"
http://www.opendatacommons.org/licenses/odbl/1.0/ or a similar
copyleft license.

See comments on the word list here:
http://fnielsen.posterous.com/old-anew-a-sentiment-about-sentiment-analysis


In Python the file may be read into a dictionary with:

>>> afinn = dict(map(lambda (k,v): (k,int(v)), 
                     [ line.split('\t') for line in open("AFINN-111.txt") ]))
>>> afinn["Good".lower()]
3
>>> sum(map(lambda word: afinn.get(word, 0), "Rainy day but still in a good mood".lower().split()))
2


