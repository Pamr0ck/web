const gulp = require("gulp4");
const less = require('gulp-less');
const path = require('./path');
const cleanCSS = require('gulp-clean-css');
module.exports = function styles(){
    return gulp.src(path.less.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.less.dest))
}