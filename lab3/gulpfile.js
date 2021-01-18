const gulp = require("gulp4")

// const serve = require('./gulp/tasks/serve')
const pug2html = require('./gulp/tasks/pug2html')
const styles = require('./gulp/tasks/styles')
const clean = require('./gulp/tasks/clean')
const script = require('./gulp/tasks/script')

const dev = gulp.parallel(pug2html, styles, script)//, fonts, imageMinify, svgSprite)
const build = gulp.series(clean, dev)

module.exports.start = gulp.series(build)
module.exports.default = gulp.series(build)

module.exports.build = gulp.series(build)
