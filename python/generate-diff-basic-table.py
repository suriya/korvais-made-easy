#!/usr/bin/env python2.7

import sys
sys.path.append('..')
from half import Korvai

# K = [ Korvai() for i in xrange(8, 11) ]
# [ k.setThalam(t*4) for (k,t) in zip(K, xrange(8, 11)) ]
# [ k.setNadais('468') for k in K ]
# [ k.setPlace(6)      for k in K ]

k = Korvai()

def texttt(s):
    return r'\verb|%s|' % str(s)

def printPage(firstNadai):
    print r"""
    \begin{table}[H]
    \begin{center}
    {\large Korvais Made Easy, Difference Method Basic Table} \\[2ex]
    \begin{tabular}{r*{4}{@{\hspace{5ex}}c}}
    """
    print r'\toprule'
    print r'      &       &            & \multicolumn{2}{c}{Difference basic} \\'
    print r'Nadai & KME Basic & Min. diff. & Positive diff. & Negative diff. \\'
    print r'\midrule'
    for secondNadai in xrange(3, 10):
        for thirdNadai in xrange(3, 10):
            k.setNadais([firstNadai, secondNadai, thirdNadai])
            basic = k.getBasic()
            basic_l, basic_r = basic.getSet(), basic.getTot()
            min_diff = k.getMinimumDifference()
            diff_basic = k.getDifferenceBasic()
            diff_basic_l, diff_basic_r = diff_basic.getSet(), diff_basic.getTot()
            neg_diff_basic = diff_basic * (-1)
            while (neg_diff_basic.getSet() - min_diff - min_diff) < 0:
                neg_diff_basic = neg_diff_basic + basic
            neg_diff_basic_l = neg_diff_basic.getSet()
            neg_diff_basic_r = neg_diff_basic.getTot()
            print r'%s & %s & %s & %s & %s \\' % (
             texttt('%d%d%d' % (firstNadai, secondNadai, thirdNadai)),
             texttt('%3d - %3d' % (basic_l, basic_r)),
             texttt(min_diff),
             texttt('%3d - %3d' % (diff_basic_l, diff_basic_r)),
             texttt('%3d - %3d' % (neg_diff_basic_l, neg_diff_basic_r)))
    print r'\bottomrule'
    print r"""\end{tabular}
    \end{center}
    \end{table}
    \newpage
    """

print r"""
    \documentclass[letter,10pt]{article}
    % \title{Aadi Thaalam, 2 Kalai, Samam to Samam}
    % \author{M H Hariharan}
    % \maketit
    \usepackage[scale=0.87,centering]{geometry}
    \usepackage{booktabs}
    \usepackage{setspace}
    \usepackage{mridangam}
    \usepackage{float}
    \usepackage{tamiltrans}
    \usepackage{color}
    \usepackage{array}
    \usepackage{colortbl}
    \newcommand{\COne}{0.8}
    \newcommand{\CTwo}{0.75}
    \newcommand{\CThree}{0.85}

    \begin{document}

"""

for firstNadai in xrange(3, 10):
    printPage(firstNadai)

print r"""
\end{document}
"""
