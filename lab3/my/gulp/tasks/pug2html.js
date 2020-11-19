const gulp = require("gulp4");
const pug = require('gulp-pug');
const path = require('./path');
const paintingsJSON = require("../../media/json/paintings.json");
const participantsJSON = require("../../media/json/participants.json");

module.exports = function pug2html(cb){
    return gulp.src(path.pug.src)
        .pipe(pug({
            locals: {paint: paintingsJSON.paints, participants: participantsJSON.participants},
            verbose: true
        }))
        .pipe(gulp.dest(path.pug.dest))
}