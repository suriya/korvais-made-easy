#!/usr/bin/env coffee

{ myassert, myParseInt } = require('./js-utils')
{ gcd, Fraction, SetTot, Korvai } = require('./korvai')

tests = () ->
  # GCD
  myassert(gcd(1, 10) == 1)
  myassert(gcd(3, 4) == 1)
  myassert(gcd(3, 6) == 3)
  myassert(gcd(4, 6) == 2)
  # Fraction
  f1 = new Fraction(3, 2)
  f2 = new Fraction(4, 5)
  f3 = f1.add(f2)
  myassert((f3.numerator == 23) and (f3.denominator == 10))
  f4 = f1.mul(f2)
  myassert((f4.numerator == 6) and (f4.denominator == 5))
  f5 = f1.mul(4)
  myassert((f5.numerator == 6) and (f5.denominator == 1))
  # Set Tot
  s1 = new SetTot(3, 11)
  s2 = new SetTot(1, 3)
  s3 = s1.add(s2)
  myassert((s3.set == 4) and (s3.tot == 14))
  # Korvai
  k = new Korvai()
  k.setNadais([3,3,4])
  console.log("Basic: #{k.basic.toString()}")
  k.setThalam(44)
  console.log("Samam: #{k.samam.toString()}")
  k.setPlace(1)
  for d in [0...8]
    k.setDifference(d)
    myassert(k.answer is null)
  k.setDifference(8)
  myassert(k.answer.set, 5)
  # In middle of count
  k = new Korvai()
  k.setNadais([6,6,4])
  myassert(k.difference_basic.set, 1)
  k.setNadais([6,4,4])
  myassert(k.basic.set, 3)

usage = () ->
  USAGE = \
  """
  Usage: #{process.argv[1]} NADAI THALAM PLACE
  Examples:
      #{process.argv[1]} 334 64 4
      #{process.argv[1]} 4-66-888 64 4

  """
  process.stdout.write(USAGE)

main = () ->
  if process.argv.length != 5
    usage()
    process.exit(1)
  nadais = process.argv[2]
  thalam = process.argv[3]
  place = process.argv[4]
  k = new Korvai()
  # k.setDebug(true)
  if nadais.indexOf('-') >= 0
    nadais = ((myParseInt(j) for j in i) for i in nadais.trim().split('-'))
    k.setNadais(nadais, does_grouping=true)
  else
    nadais = nadais.trim()
    k.setNadais(nadais, does_grouping=false)
  k.setThalam(myParseInt(thalam))
  k.setPlace(0)
  process.stdout.write("Samam to Samam: #{k.answer.set}\n")
  k.setPlace(myParseInt(place))
  process.stdout.write("Diff   Alavu\n")
  for d in [0...50]
    k.setDifference(d)
    if k.answer
      process.stdout.write("#{d}    #{k.answer.set}\n")

if not window?
  if process.argv[1] == __filename
      tests()
      try
        main()
      catch error
        console.log(error.message)
