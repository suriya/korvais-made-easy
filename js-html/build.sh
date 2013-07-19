
# coffee -c -o out/ coffeescript
webmake --ignore-errors --ext=coffee coffeescript/html-app.coffee out/bundle.js
uglifyjs out/bundle.js -o out/bundle.min.js
