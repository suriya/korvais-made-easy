#
# $Id: half.py 1057 2008-10-09 18:28:13Z suriya $
#

import sys
import string
import textwrap
import unittest
import itertools
import exceptions
from fraction import gcd
from fraction import Fraction

def all(S):
    for x in S:
        if not x:
            return False
    return True

class SetTot:
    """The alavu of a korvai and the duration it lasts.

    SetTot contains information about the alavu of a korvai which we have
    to play, and the duration for which it lasts. If we play a korvai of
    alavu __set mathirai, it lasts for a duration of __tot mathirai.

    SetTot has the following properties.
    (s1, t1) + (s2, t2) = (s1 + s2, t1 + t2)
    (s1, t1) * k = (s1 * k, t1 * k)
    """

    def __init__(self, s, t):
        self.__set = s
        self.__tot = t

    def getSet(self):
        return self.__set

    def getTot(self):
        return self.__tot

    def __str__(self):
        return '(%d, %d)' % (self.__set, self.__tot)

    def __mul__(self, i):
        assert isinstance(i, int)
        return SetTot(self.__set * i, self.__tot * i)

    def __add__(self, ob2):
        assert isinstance(ob2, SetTot)
        return SetTot(self.__set + ob2.__set, self.__tot + ob2.__tot)

    def __sub__(self, ob2):
        assert isinstance(ob2, SetTot)
        return SetTot(self.__set - ob2.__set, self.__tot - ob2.__tot)

    def __eq__(self, ob2):
        assert isinstance(ob2, SetTot)
        return (self.__set == ob2.__set) and (self.__tot == ob2.__tot)

class SetTotTest(unittest.TestCase):
    def testCases(self):
        zero = SetTot(0, 0)
        a = SetTot(3, 11)
        b = SetTot(6, 22)
        self.assertEqual(a + a, b)
        self.assertEqual(a - a, zero)
        self.assertEqual((a * -2) - (a * -3) + (a * 4), a * 5)


class Korvai:
    def __init__(self):
        self.nadais = None
        self.thalam = None
        self.place = 0
        self.difference = 0
        self.basic = None
        self.difference_basic = None
        self.minimum_difference = None
        self.samam = None
        self.answer = None
        self.debug = 0

    def checkInputNadais(self):
        for group in self.nadais:
            for nadai in group:
                if not (1 <= nadai <= 9):
                    return False
        return True

    def isInteger(self, number):
        return abs(number.getD()) == 1

    def can_start(self, place, nadai):
        # Check whether we can start nadai at this place
        # For e.g. when place = 2/3 and nadai = 3, we return true
        # For e.g. when place = 1/5 and nadai = 4, we return false
        # For e.g. when place = 1/5 and nadai = 5, we return true
        return self.isInteger(place * nadai)

    def canPlay(self, alavu, diff):
        # This function tells whether we can play a the Korvai of alavu
        # mathirai. Also the difference can be anything. i.e. If
        # self.nadai = [ 3, 3, 4] and the parameter diff = 0,
        # and alavu = 1, then we know that it is not possible to play the
        # korvai of 1 Mathirai in this pattern of nadai
        # if alavu = 3, we can play and we return true. The function checks
        # for the criteria on which alavu and diff is possible.
        assert isinstance(alavu, int)
        if isinstance(diff, int):
            diff = itertools.repeat(diff)
        _alavu = alavu
        total = Fraction(0, 1)
        for group, d in zip(self.nadais, diff):
            for nadai in group:
                # Check whether we can start nadai at this place
                if not self.can_start(total, nadai):
                    return None
                total = total + Fraction(_alavu, nadai)
            _alavu = _alavu + d
        if(self.can_start(total, 4)):
            tot = (total * 4)
            assert (tot.getD() == 1)
            return SetTot(alavu, tot.getN())
        else:
            return None

    def findBasic(self):
        self.basic = None
        if (not self.nadais):
            return
        lcm = 0
        while(not self.basic):
            lcm = lcm + 1
            self.basic = self.canPlay(lcm, 0)

    def findDifferenceBasic(self):
        if (not self.nadais):
            return
        assert (self.basic != None)
        self.difference_basic = None
        s = self.basic.getSet()
        for diff in itertools.count(1):
            for alavu in xrange(s):
                self.difference_basic = self.canPlay(alavu, diff)
                if self.difference_basic:
                    break
            if self.difference_basic:
                self.minimum_difference = diff
                break

    def findSamam(self):
        if (not self.thalam or not self.nadais):
            self.samam = None
            return
        multiplier = self.thalam / gcd(self.thalam, self.basic.getTot())
        self.samam = self.basic * multiplier

    def findAnswer(self):
        if (not self.thalam or not self.nadais):
            return
        # Check that the difference that is specified is a multiple of
        # minimum_difference
        multiplier = self.difference / self.minimum_difference
        if ((self.difference % self.minimum_difference) != 0):
            self.answer = None
            return
        place = self.place - (self.difference_basic.getTot() * multiplier)
        place = place % self.thalam
        self.answer = None
        for i in xrange(self.thalam + 1):
            if (((self.basic * i).getTot() % self.thalam) == place):
                self.answer = (self.basic * i) + (self.difference_basic * multiplier)
                break
        if(self.answer):
            # sometimes when the place is Samam, we might get the answer to be
            # ZERO. So we make it explicitly non-zero, by adding self.samam
            self.answer = self.answer + self.samam
            while(self.answer.getSet() > self.samam.getSet()):
                self.answer = self.answer - self.samam

    def setNadais(self, nadais, does_grouping=False):
        # nadais is the list of nadais in which the Korvai is to be played.
        # For the standard "Rendu Thrisram, Oru Chatursram" problem, nadais
        # would be [ 3, 3, 4]
        #
        # When the nadais is set, the basic changes. So we make it None
        if does_grouping:
            self.nadais = nadais
        else:
            self.nadais = [ [ int(i) ] for i in nadais ]
        if not self.checkInputNadais():
            if(self.debug):
                sys.stderr.write('The given Nadais ' + str(nadais) + 'are incorrect\n')
            raise exceptions.Exception("Input Nadais are incorrect")
        if(self.debug):
            sys.stderr.write('Nadais set to be: ' + str(nadais) + '\n')
        self.findBasic()
        self.findDifferenceBasic()
        self.findSamam()
        self.findAnswer()

    def setThalam(self, thalam):
        #
        # When we set the thalam, the samam value changes.
        #
        if(type(thalam) != type(5)):
            raise exceptions.Exception("Thalam should be an integer")
        if(thalam%2 != 0):
            raise exceptions.Exception("Thalam (in mathrai) should be a multiple of 2")
        self.thalam = thalam
        if(self.debug):
            sys.stderr.write('Thalam: ' + str(thalam) + '\n')
        self.findSamam()
        self.findAnswer()

    def setPlace(self, place):
        #
        # When we set place, the answer changes
        #
        self.place = int(place)
        if(self.debug):
            sys.stderr.write('Place: ' + str(self.place) + '\n')
        self.findAnswer()

    def setDifference(self, diff):
        self.difference = diff
        if(self.debug):
            sys.stderr.write('Difference: %s\n' % diff)
        self.findAnswer()

    def getBasic(self):
        return self.basic

    def getDifferenceBasic(self):
        return self.difference_basic

    def getSamam(self):
        return self.samam

    def getAnswer(self):
        return self.answer

    def getMinimumDifference(self):
        return self.minimum_difference

    def setDebug(self, debug):
        self.debug = debug

    def __str__(self):
        return textwrap.dedent("""\
        Nadais:             %s
        Thalam:             %s
        Place:              %s
        Difference:         %s
        Minimum_difference: %s
        Basic:              %s
        Difference_Basic:   %s
        Samam:              %s
        Answer:             %s""") % (
            self.nadais,
            self.thalam,
            self.place,
            self.difference,
            self.minimum_difference,
            self.basic,
            self.difference_basic,
            self.samam,
            self.answer)

class KorvaiTest(unittest.TestCase):
    def testCases(self):
        k = Korvai()
        k.setNadais([3,3,4])
        k.setThalam(44)
        k.setPlace(1)
        for d in xrange(8):
            k.setDifference(d)
            self.assertEqual(k.getAnswer(), None)
        k.setDifference(8)
        self.assertEqual(k.getAnswer().getSet(), 5)

    def testStartAtMiddleOfCount(self):
        k = Korvai()
        k.setNadais([6,6,4])
        self.assertEqual(k.getDifferenceBasic().getSet(), 1)
        k.setNadais([6,4,4])
        self.assertEqual(k.getBasic().getSet(), 3)

if (__name__ == '__main__'):
    unittest.main()
