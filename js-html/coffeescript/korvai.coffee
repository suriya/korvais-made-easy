
JSU = require('./js-utils')
{ mymod, isInteger, zip, myassert, myParseInt } = require('./js-utils')

gcd = (a, b) ->
  myassert(isInteger(a), "In gcd: '#{a}' is not an integer")
  myassert(isInteger(b), "In gcd: '#{b}' is not an integer")
  if ((b == 0) and (a == 0))
    return 0
  else if (b == 0)
    return a
  else if (mymod(a, b) == 0)
    return b
  else
    return gcd(b, mymod(a, b))

class Fraction
  constructor: (@numerator, @denominator) ->
    myassert(isInteger(@numerator), "'#{numerator} is not an integer")
    myassert(isInteger(@denominator), "'#{denominator} is not an integer")
    @simplify()

  isIntegerValue: () ->
    return (Math.abs(@denominator) == 1)


  simplify: () ->
    g = gcd(@numerator, @denominator)
    if (g != 0)
      @numerator   /= g
      @denominator /= g
    return this

  add: (op2) ->
    _numerator = (@numerator * op2.denominator) + (@denominator * op2.numerator)
    _denominator = @denominator * op2.denominator
    return new Fraction(_numerator, _denominator)

  sub: (op2) ->
    new_op2 = new Fraction(- op2.numerator, op2.denominator)
    return @add(new_op2)

  mul: (op2) ->
    if (op2 instanceof Fraction)
      _numerator = this.numerator * op2.numerator
      _denominator = this.denominator * op2.denominator
      return new Fraction(_numerator, _denominator)
    else if isInteger(op2)
      return this.mul(new Fraction(op2, 1))
    else
      myassert(false, "In Fraction.mul: invalid type of op2")

  div: (op2) ->
    return this.mul(new Fraction(op2.denominator, op2.numerator))

  equals: (op2) ->
    return (this.numerator == op2.numerator) && (this.denominator == op2.denominator)

class SetTot
  constructor: (@set, @tot) ->
    myassert(isInteger(@set))
    myassert(isInteger(@tot))

  toString: () -> "(#{@set}, #{@tot})"

  mul: (i) ->
    myassert(isInteger(i))
    return new SetTot(this.set * i, this.tot * i)

  add: (op2) ->
    myassert(op2 instanceof SetTot)
    return new SetTot(this.set + op2.set, this.tot + op2.tot)

  sub: (op2) ->
    myassert(op2 instanceof SetTot)
    return new SetTot(this.set - op2.set, this.tot - op2.tot)

  equals: (op2) ->
    myassert(op2 instanceof SetTot)
    return (this.set == op2.set) and (this.tot == op2.tot)

class Korvai
  constructor: () ->
    @nadais = null
    @thalam = null
    @place = 0
    @difference = 0
    @basic = null
    @difference_basic = null
    @minimum_difference = null
    @samam = null
    @answer = null
    @debug = 0

  checkInputNadais: () ->
    for group in @nadais
      for nadai in group
        if not (1 <= nadai <= 9)
          return false
    return true

  can_start: (place, nadai) ->
    myassert(place instanceof Fraction)
    myassert(isInteger(nadai))
      # Check whether we can start nadai at this place
      # For e.g. when place = 2/3 and nadai = 3, we return true
      # For e.g. when place = 1/5 and nadai = 4, we return false
      # For e.g. when place = 1/5 and nadai = 5, we return true
    return place.mul(nadai).isIntegerValue()

  canPlay: (alavu, diff) ->
    # This function tells whether we can play a the Korvai of alavu
    # mathirai. Also the difference can be anything. i.e. If
    # self.nadai = [ 3, 3, 4] and the parameter diff = 0,
    # and alavu = 1, then we know that it is not possible to play the
    # korvai of 1 Mathirai in this pattern of nadai
    # if alavu = 3, we can play and we return true. The function checks
    # for the criteria on which alavu and diff is possible.
    myassert(isInteger(alavu))
    if isInteger(diff)
      diff = (diff for i in @nadais)
    _alavu = alavu
    total = new Fraction(0, 1)
    for [ group, d ] in zip(@nadais, diff)
      for nadai in group
        # Check whether we can start nadai at this place
        if not @can_start(total, nadai)
          return null
        total = total.add(new Fraction(_alavu, nadai))
      _alavu = _alavu + d
    if @can_start(total, 4)
      tot = total.mul(4)
      myassert(tot.isIntegerValue())
      return new SetTot(alavu, tot.numerator)
    else
      return null

  findBasic: () ->
    @basic = null
    if (not @nadais)
      return
    lcm = 0
    while (not @basic)
      lcm = lcm + 1
      @basic = @canPlay(lcm, 0)

  findDifferenceBasic: () ->
    if (not @nadais)
      return
    myassert(@basic, "basic not set.")
    @difference_basic = null
    s = @basic.set
    diff = 0
    while true
      diff += 1
      for alavu in [0...s]
        @difference_basic = @canPlay(alavu, diff)
        if @difference_basic
          break
      if @difference_basic
        @minimum_difference = diff
        break

  findSamam: () ->
    if (not @thalam or not @nadais)
      @samam = null
      return
    myassert(isInteger(@thalam))
    multiplier = @thalam / gcd(@thalam, @basic.tot)
    myassert(isInteger(multiplier))
    @samam = @basic.mul(multiplier)

  findAnswer: () ->
    @answer = null
    if (not @thalam or not @nadais)
      return
    # Check that the difference that is specified is a multiple of
    # minimum_difference
    multiplier = @difference / @minimum_difference
    if (mymod(@difference, @minimum_difference) != 0)
      return
    place = @place - (@difference_basic.tot * multiplier)
    place = mymod(place, @thalam)
    if @debug
        console.log("Place", place)
    for i in [0..@thalam]
      if (mymod(@basic.mul(i).tot, @thalam) == place)
        @answer = @basic.mul(i).add(@difference_basic.mul(multiplier))
        break
    if (@answer)
      # sometimes when the place is Samam, we might get the answer to be
      # ZERO. So we make it explicitly non-zero, by adding @samam
      @answer = @answer.add(@samam)
      while (@answer.set > @samam.set)
        @answer = @answer.sub(@samam)

  setNadais: (nadais, does_grouping=false) ->
    # nadais is the list of nadais in which the Korvai is to be played.
    # For the standard "Rendu Thrisram, Oru Chatursram" problem, nadais
    # would be [ 3, 3, 4]
    #
    # When the nadais is set, the basic changes. So we make it null
    if does_grouping
      @nadais = nadais
    else
      @nadais = ([ myParseInt(i) ] for i in nadais)
    if not @checkInputNadais()
      if @debug
        console.log("The given Nadais '#{nadais}' are incorrect")
      throw Error("Input Nadais are incorrect: #{nadais}")
    if @debug
      console.log("Nadais set to be: '#{nadais}'")
    @findBasic()
    @findDifferenceBasic()
    @findSamam()
    @findAnswer()

  setThalam: (thalam) ->
    #
    # When we set the thalam, the samam value changes.
    #
    if not isInteger(thalam)
      throw Error("Thalam '#{thalam}' is not an integer")
    if (mymod(thalam, 2) != 0)
      throw Error("Thalam (in mathrai) should be a multiple of 2, got input '#{thalam}'")
    @thalam = thalam
    if @debug
      console.log("Thalam: #{thalam}")
    @findSamam()
    @findAnswer()

  setPlace: (place) ->
    #
    # When we set place, the answer changes
    #
    if not isInteger(place)
      throw Error("Eduppu '#{place}' is not an integer")
    @place = place
    if @debug
      console.log("Place: #{@place}")
    @findAnswer()

  setDifference: (diff) ->
    @difference = diff
    if @debug
      console.log("Difference: #{diff}")
    @findAnswer()

  setDebug: (debug) ->
    @debug = debug

  toString: () ->
    return \
    """
    Nadais:             #{nadais}
    Thalam:             #{thalam}
    Place:              #{place}
    Difference:         #{difference}
    Minimum_difference: #{minimum_difference}
    Basic:              #{basic}
    Difference_Basic:   #{difference_basic}
    Samam:              #{samam}
    Answer:             #{answer}
    """

@gcd = gcd
@Fraction = Fraction
@SetTot = SetTot
@Korvai = Korvai
