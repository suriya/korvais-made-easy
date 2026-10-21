
isInteger = (x) ->
  (typeof x is "number") and Math.floor(x) is x

@myParseInt = (s) ->
  if isInteger(s)
    return s
  s = s.trim()
  number = parseInt(s, 10)
  if String(number) isnt s
    throw Error("Input is not a number: #{s}")
  if not isInteger(number)
    throw Error("Input is not an integer: #{s}")
  return number

@mymod = (x, y) -> ((x%y)+y)%y

@flatten = (array) ->
  return [].concat.apply([], array)

@zip = () ->
  lengthArray = (arr.length for arr in arguments)
  length = Math.min(lengthArray...)
  for i in [0...length]
    arr[i] for arr in arguments

if window?
  myassert = (x, y) ->
    if not x
      if y
        throw Error("hello #{y}")
      else
        throw Error("Assertion error")
else
  pkg = 'assert'
  myassert = require(pkg).ok
@myassert = myassert
@isInteger = isInteger
