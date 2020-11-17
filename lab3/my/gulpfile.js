const gulp = require("gulp4")

const pug2html = require('./gulp/tasks/pug2html')
const styles = require('./gulp/tasks/styles')

// const server = require('browser-sync').create()

module.exports.start = gulp.series(pug2html, styles)

const del = require('del');
