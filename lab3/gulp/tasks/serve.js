const gulp = require('gulp')


const styles = require('./styles')
const pug2html = require('./pug2html')
//const script = require('./script')

const server = require('browser-sync').create()

function readyReload(cb) {
    server.reload()
    cb()
}

module.exports = function serve(cb) {
    server.init({
        server: 'build',
        notify: false,
        open: true,
        cors: true,
        port: 8443,
        https: true
    })


    gulp.watch('dev/styles/**/*.less', gulp.series(styles, cb => gulp.src('build/css').pipe(server.stream()).on('end', cb)))
    // gulp.watch('dev/js/**/*.js', gulp.series(script, readyReload))
    gulp.watch('dev/pug/**/*.pug', gulp.series(pug2html, readyReload))


    return cb()
}