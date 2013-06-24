#
# $Id: fraction.py 1012 2008-09-02 15:52:26Z suriya $
#

import unittest

def gcd(a, b):
    if (b == a == 0):
        return 0
    elif (b == 0):
        return a
    elif (a%b == 0):
        return b
    else:
        return gcd(b, a%b)

class GcdTest(unittest.TestCase):
    def testGcd(self):
        self.assertEqual(gcd(77, 19), 1)
        self.assertEqual(gcd(0, 9), 9)
        self.assertEqual(gcd(-4, 0), -4)
        self.assertEqual(gcd(18, 15), 3)


class Fraction:
    def __init__(self, numerator, denominator):
        assert isinstance(numerator, int)
        assert isinstance(denominator, int)
        self.__numerator = numerator
        self.__denominator = denominator
        self.simplify()

    def simplify(self):
        __gcd = gcd(self.__numerator, self.__denominator)
        if (__gcd != 0):
            self.__numerator   /= __gcd
            self.__denominator /= __gcd

    def getN(self):
        return self.__numerator
    def getD(self):
        return self.__denominator
    def __str__(self):
        return '%d / %d' % (self.__numerator, self.__denominator)

    def __add__(self, op2):
        result_numerator = ((self.__numerator * op2.__denominator) +
            (self.__denominator * op2.__numerator))
        result_denominator = self.__denominator * op2.__denominator
        return Fraction(result_numerator, result_denominator)

    def __sub__(self, op2):
        new_op2 = Fraction(- op2.__numerator, op2.__denominator)
        return self + new_op2

    def __mul__(self, op2):
        """overloading the * operator
        op2 can be either a Fraction or an integer"""
        if isinstance(op2, int):
            return self * Fraction(op2, 1)
        else:
            assert isinstance(op2, Fraction)
            result_numerator = self.__numerator * op2.__numerator
            result_denominator = self.__denominator * op2.__denominator
            return Fraction(result_numerator, result_denominator)

    def __div__(self, op2):
        new_op2 = Fraction(op2.__denominator, op2.__numerator)
        return self * new_op2

    def __eq__(self, op2):
        return (self.__numerator == op2.__numerator) and (self.__denominator == op2.__denominator)

class FractionTest(unittest.TestCase):
    def testCases(self):
        one = Fraction(4, 4)
        zero = Fraction(0, 51)
        f1 = Fraction(1, 2)
        f2 = Fraction(2, 4)
        f3 = Fraction(3, 6)
        f4 = f3 - f3
        self.assertEqual(f1 + zero, f1)
        self.assertEqual(f1 - zero, f1)
        self.assertEqual(f1 * zero, f2 * zero)
        self.assertEqual(f1 * zero, zero)
        self.assertEqual(f1 * one, f1)
        self.assertEqual(f1 + f1 - f1, f1)
        self.assertEqual(f1 - f1, zero)
        self.assertEqual(f1 + f1 + f1, f1 * 3)
        self.assertEqual(f1 / one, f1)
        self.assertNotEqual(f1 / zero, zero)
        self.assertNotEqual(f1 / zero, f1)

if (__name__ == '__main__'):
    unittest.main()
