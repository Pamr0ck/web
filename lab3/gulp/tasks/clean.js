const del = require('del')

module.exports = function clean(cb) {
    return del('css').then(() => {
        cb()
    })
}