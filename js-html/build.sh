
# coffee -c -o out/ coffeescript
handlebars templates/solution.handlebars -m -f out/solution.handlebars.precompiled-template.js
webmake --ignore-errors --ext=coffee coffeescript/html-app.coffee out/bundle.js
uglifyjs out/bundle.js -o out/bundle.min.js
