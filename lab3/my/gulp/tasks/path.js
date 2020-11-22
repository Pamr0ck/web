const path = {
    pug: {
        src: 'dev/pug/*.pug',
        dest: 'build/html/'
    },
    less: {
        src: 'dev/styles/*.less',
        dest: 'build/css/'
    },
    script: {
        src: 'dev/scripts/*.js',
        dest: 'build/scripts/'
    }
}
module.exports= path;