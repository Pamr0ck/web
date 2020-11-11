const gulp = require("gulp4");
const pug = require('gulp-pug');
const del = require('del');
const paths = {
    pugPaintings: {
        src: 'dev/pug/paintings.pug',
        dest: 'build/html/'
    }
}

const paintingsJSON = require("./media/json/paints.json");
function paintings() {
    return gulp.src(paths.pugPaintings.src)
        .pipe(pug({
            locals: {paint: paintingsJSON.paints},
            verbose: true
        }))
        .pipe(gulp.dest(paths.pugPaintings.dest));
}
gulp.task("default",paintings());
