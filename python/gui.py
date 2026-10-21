#!/usr/bin/env python

#
# $Id: gui.py 979 2008-04-24 20:40:45Z suriya $
#

import Tkinter
from korvai import Korvai

button_width = 3

class Calculator:
    def __createButton__(self, row, number):
        return Tkinter.Button(row, text = str(number),
        width = button_width,
        command = self.button_function_ptr[number])
    def button_function_0(self):
        self.button_function(0)
    def button_function_1(self):
        self.button_function(1)
    def button_function_2(self):
        self.button_function(2)
    def button_function_3(self):
        self.button_function(3)
    def button_function_4(self):
        self.button_function(4)
    def button_function_5(self):
        self.button_function(5)
    def button_function_6(self):
        self.button_function(6)
    def button_function_7(self):
        self.button_function(7)
    def button_function_8(self):
        self.button_function(8)
    def button_function_9(self):
        self.button_function(9)
    def button_function(self, number):
        print 'Button', number, 'pressed'
        self.textbox_string += (str(number))
        self.__updateTextBox()
    def clear(self):
        self.textbox_string = ''
        self.__updateTextBox()
        self.korvai = Korvai()
        print 'clear pressed'
    def nadai(self):
        nadai = self.textbox_string
        self.korvai.setNadais(nadai)
        self.textbox_string = ''
        self.__updateTextBox()
        print 'nadai pressed with', nadai
    def thalam(self):
        thalam = int(self.textbox_string)
        self.korvai.setThalam(thalam)
        self.textbox_string = ''
        self.__updateTextBox()
        print 'thalam pressed with', thalam
    def diff(self):
        diff = int(self.textbox_string)
        self.korvai.setDifference(diff)
        self.textbox_string = ''
        self.__updateTextBox()
        print 'diff pressed with', diff
    def place(self):
        place = int(self.textbox_string)
        self.korvai.setPlace(place)
        self.textbox_string = ''
        self.__updateTextBox()
        print 'place pressed with', place 
    def enter(self):
        self.korvai.dumpParamters()
        self.textbox_string = ''
        answer = self.korvai.getAnswer()
        if(answer != None):
            self.textbox.config(text = str(answer.getSet()))
        else:
            self.textbox.config(text = '***')
    def __updateTextBox(self):
        self.textbox.config(text = self.textbox_string)
    def __init__(self):
        # self.textbox = Tkinter.Label(justify = Tkinter.LEFT)
        # Tkinter.Button(row_frames[-1], text = '7').pack(side = 'left')
        self.button_function_ptr = [
          self.button_function_0,
          self.button_function_1,
          self.button_function_2,
          self.button_function_3,
          self.button_function_4,
          self.button_function_5,
          self.button_function_6,
          self.button_function_7,
          self.button_function_8,
          self.button_function_9, ]
        rows = []
        for i in range(4):
            rows.append(Tkinter.Frame())
        button_widgets = range(10)
        # row 0
        button_widgets[0] = self.__createButton__(rows[3], 0)
        button_widgets[1] = self.__createButton__(rows[2], 1)
        button_widgets[2] = self.__createButton__(rows[2], 2)
        button_widgets[3] = self.__createButton__(rows[2], 3)
        button_widgets[4] = self.__createButton__(rows[1], 4)
        button_widgets[5] = self.__createButton__(rows[1], 5)
        button_widgets[6] = self.__createButton__(rows[1], 6)
        button_widgets[7] = self.__createButton__(rows[0], 7)
        button_widgets[8] = self.__createButton__(rows[0], 8)
        button_widgets[9] = self.__createButton__(rows[0], 9)
        for i in range(10):
            button_widgets[i].pack(side = 'left')
        clear_button = Tkinter.Button(rows[0], text = 'AC',
        width = button_width,
        command = self.clear)
        clear_button.pack(side = 'left')
        nadai_button = Tkinter.Button(rows[1], text = 'N',
        width = button_width,
        command = self.nadai)
        nadai_button.pack(side = 'left')
        thalam_button = Tkinter.Button(rows[2], text = 'T',
        width = button_width,
        command = self.thalam)
        thalam_button.pack(side = 'left')
        diff_button = Tkinter.Button(rows[3], text = 'D',
        width = button_width,
        command = self.diff)
        diff_button.pack(side = 'left')
        place_button = Tkinter.Button(rows[3], text = 'P',
        width = button_width,
        command = self.place)
        place_button.pack(side = 'left')
        enter_button = Tkinter.Button(rows[3], text = '=',
        width = button_width,
        command = self.enter)
        enter_button.pack(side = 'left')
        self.textbox_string = ''
        self.textbox = Tkinter.Label()
        self.textbox.pack()
        for i in range(4):
            rows[i].pack()
        self.korvai = Korvai()

Calculator()
Tkinter.mainloop()
