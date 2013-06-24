
package org.korvai.kme;

import javax.microedition.lcdui.*;
import javax.microedition.midlet.MIDlet;


/**
 * The textbox demo displays a list of all the text box types and allows the
 * user to select a specific type of text box to try.
 *
 * @version 2.0
 */
public class MobileUI extends MIDlet implements CommandListener {
    private static final Command CMD_EXIT = new Command("Exit", Command.EXIT, 1);
    private static final Command CMD_BACK = new Command("Back", Command.BACK, 1);
    private static final Command CMD_SHOW = new Command("Show", Command.SCREEN, 1);

    private Display display;
    private Form mainForm;
    TextField nadai, thalam, place;
    private boolean firstTime;

    public MobileUI() {
        display = Display.getDisplay(this);
        firstTime = true;
    }

    protected void startApp() {
        if (firstTime) {
            mainForm = new Form("Select a Text Box Type");
            nadai = new TextField("Nadai", "", 6, TextField.NUMERIC);
            thalam = new TextField("Thalam", "", 3, TextField.NUMERIC);
            place = new TextField("Place", "", 3, TextField.NUMERIC);
            mainForm.append(nadai);
            mainForm.append(thalam);
            mainForm.append(place);

            mainForm.addCommand(CMD_SHOW);
            mainForm.addCommand(CMD_EXIT);
            mainForm.setCommandListener(this);
            firstTime = false;
        }
        display.setCurrent(mainForm);
    }

    protected void destroyApp(boolean unconditional) {
    }

    protected void pauseApp() {
    }

    public void commandAction(Command c, Displayable d) {
        if (c == CMD_EXIT) {
            destroyApp(false);
            notifyDestroyed();
        } else if (c == CMD_SHOW) {
            TextBox textBox = new TextBox("Suriya", "", 5000, TextField.ANY);
            try {
              String s = Wrapper.doAll(nadai.getString(), thalam.getString(), place.getString());
              System.out.println(s);
              textBox.setString(s);
            } catch (Exception e) {
              textBox.setString(e.toString());
            }
            textBox.addCommand(CMD_BACK);
            textBox.addCommand(CMD_EXIT);
            textBox.setCommandListener(this);
            display.setCurrent(textBox);
        } else if (c == CMD_BACK) {
            display.setCurrent(mainForm);
        }
    }
}
