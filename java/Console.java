/*
 * $Id: Console.java 701 2006-10-18 01:08:18Z suriya $
 */

import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.text.NumberFormat;

class Console {

  static InputStreamReader isr = new InputStreamReader(System.in);
  static BufferedReader    in  = new BufferedReader(isr);

  public static String readString() {
    try {
      return in.readLine();
    } catch (Exception e) {
      System.err.println("readString(): Unable to read from stdin");
      System.exit(1);
      return "";
    }
  }

  public static int readInt() {
    String numberString = Console.readString();
    try {
      numberString = numberString.trim().toUpperCase();
      return NumberFormat.getInstance().parse(numberString).intValue();
    } catch (Exception e) {
      System.out.println("readInt(): Unable to read from stdin");
      System.exit(1);
      return 0;
    }
  }

  public static int intPrompt(String s) {
    System.out.print(s);
    return Console.readInt();
  }

  public static void main(String args[]) throws Exception {
    Korvai k = new Korvai();
    int times = Console.intPrompt("Please enter the number of times the Korvai will be played: ");
    int[] nadais = new int[times];
    for (int i = 0; i < times; i++) {
      nadais[i] = Console.intPrompt("Please enter nadai " + (i+1) + ": ");
    }
    k.setNadais(nadais);
    k.setThalam(Console.intPrompt("Please enter the Thalam in Mathirai: "));
    k.setPlace(Console.intPrompt("Please enter the Idam in Mathirai: "));
    k.setHalf(true);
    SetTot answer = k.getAnswer();
    if (answer != null) {
      System.out.println("The answer is: " + answer);
    } else {
      System.out.println("There is no answer");
    }
  }
}
