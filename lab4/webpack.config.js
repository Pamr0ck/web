module.exports = {
  entry: {
      enter: './public/scripts/enter.js',
      admin: './public/scripts/admin.js',
      user: './public/scripts/user.js'
  },
    output: {
        filename: './scripts/[name].js'
    }
};