/*
 * $Id: Korvai.java 1014 2008-09-02 16:54:44Z suriya $
 */

package org.korvai.kme;

class SetTot {
  int set;
  int tot;

  public SetTot(int set, int tot) {
    this.set = set;
    this.tot = tot;
  }

  public int getSet() {
    return this.set;
  }

  public int getTot() {
    return this.tot;
  }

  public String toString() {
    return "(" + this.set + " - " + this.tot + ")";
  }

  public SetTot mul(int i) {
    return new SetTot(this.set * i, this.tot * i);
  }

  public SetTot add(SetTot op2) {
    return new SetTot(this.set + op2.set, this.tot + op2.tot);
  }

  public SetTot sub(SetTot op2) {
    return new SetTot(this.set - op2.set, this.tot - op2.tot);
  }

  public boolean equals(SetTot op2) {
    return (this.set == op2.set) && (this.tot == op2.tot);
  }
}

public class Korvai {
  boolean half = false;
  int[] nadais = null;
  int thalam = 0;
  int place = 0;
  int difference = 0;
  SetTot basic = null;
  SetTot difference_basic = null;
  int minimum_difference = 0;
  SetTot samam = null;
  SetTot answer = null;
  boolean debug = false;

  private boolean checkInputNadais() {
    for (int i = 0, length = this.nadais.length; i < length; i++) {
      if (!((1 <= this.nadais[i]) && (this.nadais[i] <= 9))) {
        return false;
      }
    }
    return true;
  }

  private static boolean isInteger(Fraction number) {
    return java.lang.Math.abs(number.getD()) == 1;
  }

  private static boolean canStart(Fraction place, int nadai) {
    return Korvai.isInteger(place.mul(nadai));
  }

  private static boolean related(int prev, int next) {
    return ((prev * 2 == next) ||
            (next * 2 == prev) ||
            (prev == next));
  }

  private SetTot canPlay(int alavu, int diff) {
    int _alavu = alavu;
    int length = this.nadais.length;
    Fraction[] starting_place = new Fraction[length+1];
    starting_place[0] = new Fraction(0, 1);
    int last_nadai = 0;
    for (int i = 0; i < length; i++) {
      int nadai = this.nadais[i];
      if (! Korvai.canStart(starting_place[i], nadai)) {
        return null;
      }
      if (! this.half) {
        if ((! Korvai.isInteger(starting_place[i])) &&
            (! Korvai.related(last_nadai, nadai))) {
          return null;
        }
      }
      last_nadai = nadai;
      starting_place[i+1] = starting_place[i].add(new Fraction(_alavu, nadai));
      _alavu += diff;
    }
    if (Korvai.canStart(starting_place[length], 4)) {
      Fraction tot = starting_place[length].mul(4);
//       assert (tot.getD() == 1);
      return new SetTot(alavu, tot.getN());
    } else {
      return null;
    }
  }

  private void findBasic() {
    this.basic = null;
    if (this.nadais == null) {
      return;
    }
    int lcm = 0;
    while (this.basic == null) {
      lcm += 1;
      this.basic = this.canPlay(lcm, 0);
    }
  }

  private void findDifferenceBasic() {
    if (this.nadais == null) {
      return;
    }
//     assert (this.basic != null);
    this.difference_basic = null;
    int s = this.basic.getSet();
    for (int diff = 1; ; diff++) {
      for (int alavu = 0; (alavu < s) && (this.difference_basic == null); alavu++) {
        this.difference_basic = this.canPlay(alavu, diff);
      }
      if (this.difference_basic != null) {
        this.minimum_difference = diff;
        break;
      }
    }
  }

  private void findSamam() {
    if ((this.thalam == 0) || (this.nadais == null)) {
      this.samam = null;
      return;
    }
    int multiplier = this.thalam / Gcd.gcd(this.thalam, this.basic.getTot());
    this.samam = this.basic.mul(multiplier);
  }

  private void findAnswer() {
    this.answer = null;
    if ((this.thalam == 0) || (this.nadais == null)) {
      return;
    }
    if (this.difference % this.minimum_difference != 0) {
      if (this.debug) {
        System.err.println("Difference not a multiple of minimum_difference");
      }
      return;
    }
    int multiplier = this.difference / this.minimum_difference;
    int _place = this.place - (this.difference_basic.getTot() * multiplier);
    _place %= this.thalam;
    // make _place non-negative
    _place += this.thalam;
    _place %= this.thalam;
    for (int i = 0; i < this.thalam + 1; i++) {
      if ((this.basic.mul(i).getTot() % this.thalam) == _place) {
        this.answer = this.basic.mul(i).add(this.difference_basic.mul(multiplier));
        break;
      }
    }
    if (this.answer != null) {
      this.answer = this.answer.add(this.samam);
      while (this.answer.getSet() > this.samam.getSet()) {
        this.answer = this.answer.sub(this.samam);
      }
    }
  }

  public void setHalf(boolean half) {
    this.half = half;
    this.findBasic();
    this.findDifferenceBasic();
    this.findSamam();
    this.findAnswer();
  }

  public void setNadais(int[] nadais) throws org.korvai.kme.Exception {
    this.nadais = nadais;
    if (! this.checkInputNadais()) {
      throw new org.korvai.kme.Exception("Input nadais are incorrect");
    }
    if (this.debug) {
      System.err.println("Nadais set to be: " + this.nadais.toString());
    }
    this.findBasic();
    this.findDifferenceBasic();
    this.findSamam();
    this.findAnswer();
  }

  public void setThalam(int thalam) throws org.korvai.kme.Exception {
    if (thalam%2 != 0) {
      throw new org.korvai.kme.Exception("Thalam (in mathrai) should be a multiple of 2");
    }
    this.thalam = thalam;
    if (this.debug) {
      System.err.println("Thalam: " + thalam);
    }
    this.findSamam();
    this.findAnswer();
  }

  public void setPlace(int place) {
    this.place = place;
    if (this.debug) {
      System.err.println("Place: " + place);
    }
    this.findAnswer();
  }

  public void setDifference(int difference) {
    this.difference = difference;
    if (this.debug) {
      System.err.println("Difference: " + difference);
    }
    this.findAnswer();
  }

  public SetTot getBasic() {
    return this.basic;
  }

  public SetTot getDifferenceBasic() {
    return this.difference_basic;
  }

  public SetTot getSamam() {
    return this.samam;
  }

  public SetTot getAnswer() {
    return this.answer;
  }

  public int getMinimumDifference() {
    return this.minimum_difference;
  }

  public void setDebug(boolean debug) {
    this.debug = debug;
  }

  public String toString() {
    return 
		  "Nadais:               " + this.nadais
		+ "\nThalam:             " + this.thalam
		+ "\nPlace:              " + this.place
		+ "\nDifference:         " + this.difference
		+ "\nMinimum_difference: " + this.minimum_difference
		+ "\nChapu:              " + this.half
		+ "\nBasic:              " + this.basic
		+ "\nDifference_Basic:   " + this.difference_basic
		+ "\nSamam:              " + this.samam
		+ "\nAnswer:             " + this.answer;
  }
}
