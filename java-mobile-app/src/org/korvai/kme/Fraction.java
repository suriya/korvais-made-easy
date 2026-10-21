/*
 * $Id: Fraction.java 1015 2008-09-03 00:23:29Z suriya $
 */

package org.korvai.kme;

class Gcd {
  public static int gcd(int a, int b) {
    if ((b == 0) && (a == 0)) {
      return 0;
    } else if (b == 0) {
      return a;
    } else if (a%b == 0) {
      return b;
    } else {
      return gcd(b, a%b);
    }
  }
}

public class Fraction {
  private int numerator;
  private int denominator;

  public Fraction(int numerator, int denominator) {
    this.numerator = numerator;
    this.denominator = denominator;
    this.simplify();
  }

  private void simplify() {
    int gcd = Gcd.gcd(this.numerator, this.denominator);
    if (gcd != 0) {
      this.numerator   /= gcd;
      this.denominator /= gcd;
    }
  }

  public int getN() {
    return this.numerator;
  }

  public int getD() {
    return this.denominator;
  }

  public Fraction add(Fraction op2) {
    int _numerator = (this.numerator * op2.denominator) + (this.denominator * op2.numerator);
    int _denominator = this.denominator * op2.denominator;
    return new Fraction(_numerator, _denominator);
  }

  public Fraction sub(Fraction op2) {
    Fraction new_op2 = new Fraction(- op2.numerator, op2.denominator);
    return this.add(new_op2);
  }

  public Fraction mul(Fraction op2) {
    int _numerator = this.numerator * op2.numerator;
    int _denominator = this.denominator * op2.denominator;
    return new Fraction(_numerator, _denominator);
  }

  public Fraction mul(int n) {
    return this.mul(new Fraction(n, 1));
  }

  public Fraction div(Fraction op2) {
    return this.mul(new Fraction(op2.denominator, op2.numerator));
  }

  public boolean equals(Fraction op2) {
    return (this.numerator == op2.numerator) && (this.denominator == op2.denominator);
  }
}
