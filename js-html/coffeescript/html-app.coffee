
{ Korvai } = require('./korvai')
{ flatten, zip, myParseInt } = require('./js-utils')
require('../js/purl')

cleanNadais = (nadais) ->
  if typeof(nadais) == 'string'
    nadais.replace(/[^0-9\-]/g, '').replace(/-+/g, '-')
  else
    undefined
cleanPlace = cleanThalam = (s) ->
  if typeof(s) == 'string'
    s.replace(/[^0-9]/g, '')
  else
    undefined
cleanParams = (params) ->
  { nadais, thalam, place } = params
  nadais = cleanNadais(nadais)
  thalam = cleanThalam(thalam)
  place = cleanPlace(place)
  return { nadais: nadais, thalam: thalam, place: place }

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

calculate = (params) ->
  ###
    Returns an HTML table's contents
  ###
  { nadais, thalam, place } = params
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

readParamsFromForm = () ->
  nadais = $('#id_nadais').val()
  thalam = $('#id_thalam').val()
  place = $('#id_place').val()
  params = { nadais: nadais, thalam: thalam, place: place }
  return cleanParams(params)

readParamsFromURL = () ->
  params = $.url().param()
  return cleanParams(params)

makeNewUrl = (params) ->
  { nadais, thalam, place } = params
  o = $.url()
  newurl = "#{o.attr('path')}?nadais=#{nadais}&thalam=#{thalam}&place=#{place}"

updateURL = (params) ->
  newurl = makeNewUrl(params)
  console.log("Updating page with new URL: #{newurl}")
  history.pushState({}, '', newurl)

updateTable = (params) ->
  console.log("Input", params)
  tablerows = calculate(params)
  source = $("#output-template").html()
  template = Handlebars.compile(source)
  context = { tablerows: tablerows }
  html = template(context)
  $("#output-template-output").html(html)

updateInputForm = (params) ->
  { nadais, thalam, place } = params
  $('#id_nadais').val(nadais)
  $('#id_thalam').val(thalam)
  $('#id_place').val(place)

pageLoadHandler = () ->
  params = readParamsFromURL()
  { nadais, thalam, place } = params
  if not nadais? or not thalam? or not place?
    console.log('Page load. No params in URL.')
    return
  updateInputForm(params)
  updateTable(params)

formSubmitHandler = () ->
  params = readParamsFromForm()
  updateTable(params)
  updateURL(params)

htmlAppRegisterAll = () ->
  $(document).ready(() ->
    $("#form-submit-button").click(formSubmitHandler)
    pageLoadHandler()
  )

htmlAppRegisterAll()
