#!/usr/bin/env python2.7

import sys
sys.path.append('..')
from half import Korvai
import optparse

# Command line flags
version_str = """\
Copyright 2005-2013 Suriya Subramanian <suriya@alumni.cs.utexas.edu>"""
cmdline = optparse.OptionParser(version=version_str)
cmdline.add_option('-n', '--nadai', help='the NADAIs to play the Korvais')
cmdline.add_option('-t', '--thalam', help='the THALAM')
cmdline.add_option('-p', '--place', help='the PLACE')
(options, args) = cmdline.parse_args()

# Do the work
k = Korvai()
if (options.nadai is None) or (options.thalam is None) or (options.place is None):
    print >> sys.stderr, "Usage: %s -h" % sys.argv[0]
    sys.exit(1)
if ' ' in options.nadai:
    nadais = [ [ int(j) for j in i ] for i in options.nadai.strip().split(' ') ]
    k.setNadais(nadais, does_grouping=True)
else:
    k.setNadais(options.nadai, does_grouping=False)
k.setThalam(int(options.thalam))
k.setPlace(0)
print 'Samam to Samam', k.getAnswer().getSet()
k.setPlace(int(options.place))
print '%4s   %5s' % ('Diff', 'Alavu')
for d in xrange(0, 50):
    k.setDifference(d)
    answer = k.getAnswer()
    if answer is not None:
        print '%4d   %5d' % (d, answer.getSet())
