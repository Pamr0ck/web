const gulp = require("gulp4");
const pug = require('gulp-pug');
const paintingsJSON = require("../../media/json/paints.json");
module.exports = function pug2html(cb){
    return gulp.src('dev/pug/*.pug')
        .pipe(pug({
            locals: {paint: paintingsJSON.paints},
            verbose: true
        }))
        .pipe(gulp.dest('build/html'))
}