/*
 * $Id: Wrapper.java 1014 2008-09-02 16:54:44Z suriya $
 */

package org.korvai.kme;

class Wrapper {
  private static int[] parseNadais(String input) {
    input = input.trim();
    int[] nadais = new int[input.length()];
    for (int l = input.length(), i = 0; i < l; i++) {
      nadais[i] = Integer.parseInt(input.substring(i, i+1));
    }
    return nadais;
  }

  public static String doAll(String nadais, String thalam, String place) throws org.korvai.kme.Exception {
    int[] nadais_i;
    int thalam_i, place_i;
    try {
      nadais_i = parseNadais(nadais);
      thalam_i = Integer.parseInt(thalam.trim());
      place_i = Integer.parseInt(place.trim());
    } catch (NumberFormatException nfe) {
      throw new org.korvai.kme.Exception("nfe");
    }
    StringBuffer sb = new StringBuffer();
    sb.append("Nadai: " + nadais + "\n");
    sb.append("Thalam: " + thalam + "\n");
    sb.append("Place: " + place + "\n");
    Korvai k = new Korvai();
    k.setHalf(true);
    k.setNadais(nadais_i);
    SetTot basic = k.getBasic();
    sb.append("Basic: " + basic.toString() + "\n");
    k.setThalam(thalam_i);
    k.setPlace(0);
    int ss = k.getAnswer().getSet();
    sb.append("SS: " + ss + "\n");
    k.setPlace(place_i);
    int min_diff = k.getMinimumDifference();
    for (int i = 0, solutions = 0; (i < 100) && (solutions < 10); i++) {
      int diff = min_diff * i;
      k.setDifference(diff);
      SetTot answer = k.getAnswer();
      if (answer != null) {
        sb.append("Diff: " + diff + " Answer: " + answer.getSet() + "\n");
        solutions++;
      }
    }
    return sb.toString();
  }
}