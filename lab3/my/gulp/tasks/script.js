const gulp = require('gulp')
const babel = require('gulp-babel')
const path = require('./path');

module.exports = function script() {
    return gulp.src(path.script.src)
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(gulp.dest(path.script.dest))
}