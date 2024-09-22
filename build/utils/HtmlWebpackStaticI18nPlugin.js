const HtmlWebpackPlugin = require('html-webpack-plugin')
const staticI18n = require('static-i18n')
const path = require('path')

class HtmlWebpackStaticI18nPlugin {
  constructor(options) {
    this.options = options
    this.results = {}
  }

  apply (compiler) {
    const pluginName = HtmlWebpackStaticI18nPlugin.name

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation)
      hooks.beforeEmit.tapAsync(
        pluginName,
        (data, cb) => {
          staticI18n.process(data.html, this.options).then((results) => {
            this.results = results
            data.html = results[this.options.locale]
            cb(null, data)
          })
        }
      )
      hooks.afterEmit.tap(
        pluginName,
        () => {
          for (const locale in this.results) {
            if (locale === this.options.locale) continue
            const result = this.results[locale]
            const output = path.join(locale, this.options.filename)
            compilation.emitAsset(output, new compiler.webpack.sources.RawSource(result))
          }
          this.results = {}
        }
      )
    })
  }
}

module.exports = HtmlWebpackStaticI18nPlugin