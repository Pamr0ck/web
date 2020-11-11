const gulp = require("gulp4");
const pug2html = require('./gulp/tasks/pug2html')
module.exports.start = gulp.series(pug2html)

const del = require('del');
const paths = {
    pugPaintings: {
        src: 'dev/pug/paintings.pug',
        dest: 'build/html/'
    }
}
