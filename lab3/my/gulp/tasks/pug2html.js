const gulp = require("gulp4");
const pug = require('gulp-pug');
const path = require('./path');
const paintingsJSON = require("../../media/json/paintings.json");
module.exports = function pug2html(cb){
    return gulp.src(path.pug.src)
        .pipe(pug({
            locals: {paint: paintingsJSON.paints},
            verbose: true
        }))
        .pipe(gulp.dest(path.pug.dest))
}