const path = require('path')
const name = process.env.VUE_APP_NAME

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/kdum_master/' : '/KEUMWebVue/', // TODO: Remember to change this to fit your need
  lintOnSave: process.env.NODE_ENV === 'development',
  pwa: {
    name: name
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // Provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)
    config.plugins.delete('prefetch')
  },
  devServer: {
    hot: true,
    port: 8085,
    host: 'localhost',
    https: false,
    open: true,
    hotOnly: true
  }
}
