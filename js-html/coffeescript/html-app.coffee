
Korvai = require('./korvai').Korvai
JSU = require('./js-utils')
mymod = JSU.mymod
isInteger = JSU.isInteger
flatten = JSU.flatten
zip = JSU.zip
myassert = JSU.myassert
myParseInt = JSU.myParseInt

showOutput = () ->
  source = $("#input-template").html()
  template = Handlebars.compile(source)
  context = { nadais: "3 3 4", thalam: "64", place: 4 }
  html = template(context)
  $("#input-template-output").html(html)

answerToAlavus = (k, samamtosamam) ->
  ###
  Given a particular answer, return all the alavus of the Korvais in each
  of the input nadais. In addition, add any samam to samam that's
  specified.
  ###
  if not k
    return null
  if not k.answer
    return null
  alavus = []
  _alavu = k.answer.set + samamtosamam
  _diff = 0
  diffArray = (k.difference for i in k.nadais)
  for [ group, diff ] in zip(k.nadais, diffArray)
    for nadai in group
      value = _alavu + _diff
      alavus.push(value)
    _diff += diff
  return alavus

unifyArray = (a) ->
  output = {}
  for key in [0...a.length]
     output[a[key]] = a[key]
  value for key, value of output

isArraySimple = (alavus) ->
  ###
  Are all elements in the array the same?
  ###
  for a in alavus
    if not value?
      value = a
    if (a != value)
      return false
  return true

alavusHTMLRow = (alavus) ->
  if not alavus
    return ''
  decorate = if isArraySimple(alavus) then "info" else ""
  columns = ("<td>#{i}</td>" for i in alavus).join("")
  return "<tr class=\"#{decorate}\">#{columns}</tr>\n"

nadaisHTMLRow = (nadais) ->
  if not nadais
    return ''
  nadais = flatten(nadais)
  columns = ("<td>#{i}</td>" for i in nadais).join("")
  return "<tr class=\"success\">#{columns}</tr>\n"

arraySum = (a) -> a.reduce(((x, y) -> x + y), 0)

sortfn = (arrayA, arrayB) -> arraySum(arrayA) - arraySum(arrayB)
# for [ a, b ] in zip(arrayA, arrayB)
#   if a != b
#     return (a - b)
# return 0

calculate = (nadais, thalam, place) ->
  ###
    Returns an HTML table's contents
  ###
  try
    k = new Korvai()
    if nadais.indexOf('-') >= 0
      nadais = ((myParseInt(j) for j in i) for i in nadais.trim().split('-'))
      k.setNadais(nadais, does_grouping=true)
    else
      nadais = nadais.trim()
      k.setNadais(nadais, does_grouping=false)
    k.setThalam(myParseInt(thalam))
    samamtosamam = k.samam.set
    k.setPlace(myParseInt(place))
    solutions = []
    for d in [0...50]
      k.setDifference(d)
      if not k.answer
        continue
      for i in [0...2]
        solution = answerToAlavus(k, samamtosamam * i)
        if solution
          solutions.push(solution)
    solutions = solutions.sort(sortfn)
    nadairow = nadaisHTMLRow(k.nadais)
    solutionrows = (alavusHTMLRow(s) for s in solutions).join('\n')
    return (nadairow + solutionrows)
  catch error
    return error.message

cleanNadais = (nadais) -> nadais.replace(/[^0-9\-]/g, '').replace(/-+/g, '-')
cleanPlace = cleanThalam = (s) -> s.replace(/[^0-9]/g, '')

updateOutput = () ->
  nadais = $('#id_nadais').val()
  thalam = $('#id_thalam').val()
  place = $('#id_place').val()
  nadais = cleanNadais(nadais)
  thalam = cleanThalam(thalam)
  place = cleanPlace(place)
  console.log("Nadais", nadais)
  console.log("Thalam", thalam)
  console.log("Place", place)
  tablerows = calculate(nadais, thalam, place)
  source = $("#output-template").html()
  template = Handlebars.compile(source)
  context = { tablerows: tablerows }
  html = template(context)
  $("#output-template-output").html(html)

htmlAppRegisterAll = () ->
  $(document).ready(() ->
    $("#form-submit-button").click(() -> updateOutput())
    # showOutput()
  )

htmlAppRegisterAll()
