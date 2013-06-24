#!/usr/bin/env python2.7

import sys
sys.path.append('..')
from half import Korvai

# K = [ Korvai() for i in xrange(8, 11) ]
# [ k.setThalam(t*4) for (k,t) in zip(K, xrange(8, 11)) ]
# [ k.setNadais('468') for k in K ]
# [ k.setPlace(6)      for k in K ]


songNadais = [
"234",
"333",
"334",
"335",
"336",
"343",
"344",
"345",
"346",
"353",
"354",
"355",
"363",
"364",
"365",
"366",
"433",
"434",
"435",
"436",
"443",
"444",
"445",
"446",
"453",
"454",
"455",
"456",
"463",
"464",
"465",
"466",
"533",
"534",
"535",
"536",
"543",
"544",
"545",
"546",
"553",
"554",
"555",
"563",
"564",
"633",
"634",
"635",
"636",
"643",
"644",
"646",
"653",
"663",
]

mridangamNadais = [
"234",
"333",
"334",
"336",
"338",
"344",
"346",
"348",
"364",
"366",
"368",
"388",
"433",
"436",
"438",
"443",
"444",
"446",
"448",
"463",
"466",
"468",
"486",
"488",
"633",
"634",
"638",
"643",
"644",
"648",
"663",
"664",
"666",
"668",
"683",
"684",
"688",
"833",
"834",
"836",
"843",
"844",
"846",
"863",
"864",
"866",
"883",
"884",
"886",
"888",
]

allNadais = songNadais


ThalamPlaces = [
(8, 0),
(8, -1),
(8, 1),
(8, -2),
(8, 2),
(8, 3),
(8, 4),
(8, 6),

(16, -2),
(16, 0),
(16, 2),
(16, 4),
(16, 6),

(3, -3), (3, -2), (3, -1), (3, 0), (3, 1), (3, 2),

(3.5, 0), (3.5, 3), (3.5, 4),

]


k = Korvai()

def texttt(s):
    return r'\verb|%s|' % str(s)
    return r'\texttt{%s}' % str(s)
    return str(s)

def printThalamPlace(thalam, place):
    k.setThalam(int(thalam * 4))
    k.setPlace(place)
    print r"""
    \begin{table}[H]
    \begin{center}
    \textbf{%s Count Thalam, %d Mathrai (letters) Eduppu}
    %% \textbf{\tamil{?? eNNikkai tALam, ?? mAttirai taLLi}}
    \end{center}
    \begin{center}
    \begin{tabular}{>{\columncolor[gray]{\COne}}c>{\columncolor[gray]{\CTwo}}r*{16}{>{\columncolor[gray]{\CThree}}r}}
    """ % (thalam, place)
    # line = r' \tamil{naDai} & \tamil{chamam} & \multicolumn{16}{>{\columncolor[gray]{\CThree}}c}{\tamil{iDam: %d mAttirai}, Difference method} \\ ' % place
    line = r""" Nadai & SS & \multicolumn{16}{>{\columncolor[gray]{\CThree}}c}
    {Alavu/Size of the Korvai in Mathrai/Letters with difference as 3, 6, 9,
    ... Mathrai/letters} \\ """
    print line
    line = r' & '
    for d in xrange(0, 47, 3):
        line += ('& %5d' % d)
    line += r' \\ '
    print line
    print r'\hline'
    print r'\hline'

    for n in allNadais:
        if ('3' in n) and (isinstance(thalam, float)): continue
        k.setNadais(n)
        line = texttt(n) + '   '
        k.setPlace(0)
        k.setDifference(0)
        line += ' & ' + texttt(k.getAnswer().getSet())
        k.setPlace(place)
        empty = True
        for d in xrange(0, 47, 3):
            k.setDifference(d)
            answer = k.getAnswer()
            if answer is not None:
                empty = False
                # line += ('%5d' % answer.getSet())
                line += (' & ' + texttt('%3d' % answer.getSet()))
            else:
                # line += ('%5s' % '--')
                line += ' & ' + texttt(' --')
        line += r' \\ '
        if not empty:
            print line
    print r"""\end{tabular}
    \end{center}
    \end{table}
    %% \newpage
    """

print r"""
    \documentclass[a4paper,10pt]{article}
    % \title{Aadi Thaalam, 2 Kalai, Samam to Samam}
    % \author{M H Hariharan}
    % \maketit
    \usepackage[scale=0.87,centering]{geometry}
    \usepackage{setspace}
    \usepackage{mridangam}
    \usepackage{float}
    \usepackage{tamiltrans}
    \usepackage{color}
    \usepackage{array}
    \usepackage{colortbl}
    \usepackage{url}
    \newcommand{\COne}{0.8}
    \newcommand{\CTwo}{0.75}
    \newcommand{\CThree}{0.85}
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \lhead{}
    \chead{}
    \rhead{Korvais Made Easy}
    \lfoot{}
    \cfoot{\thepage}
    \rfoot{Suriya Subramanian \url{<suriya@korvai.org>}}
    \renewcommand{\headrulewidth}{0.4pt}
    \renewcommand{\footrulewidth}{0.4pt}

    \begin{document}

"""

for thalam, place in ThalamPlaces:
    printThalamPlace(thalam, place)

print r"""
\end{document}
"""
