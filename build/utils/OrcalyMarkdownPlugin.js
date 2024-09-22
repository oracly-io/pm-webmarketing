const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const https = require('node:https')
const fs = require('node:fs')
const { Converter } = require('hackmd-to-html-cli')
const debug = require('debug')('pm:build:md-plugin')
const fsPromises = fs.promises

class OrcalyMarkdownPlugin {
  constructor(options) {
    this.options = options

    this.fetched = false
  }

  apply (compiler) {
    const pluginName = OrcalyMarkdownPlugin.name

    const name = this.options.name
    const markdownFile = this.options.markdownFile || `${name}.md`
    const htmlFile = this.options.htmlFile || `${name}.html`
    const menuHtmlFile = this.options.menuHtmlFile || `${name}-menu.html`
    const tag = this.options.menuTag || `{{${name}-content}}`
    const menuTag = this.options.menuTag || `{{${name}-menu}}`
    const markdownUrl = this.options.markdownUrl

    const markdownFilePath = path.resolve(compiler.options.output.path, markdownFile)
    const htmlFilePath = path.resolve(compiler.options.output.path, htmlFile)
    const menuHtmlFilePath = path.resolve(compiler.options.output.path, menuHtmlFile)

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation)
      hooks.beforeEmit.tapPromise(
        pluginName,
        async (data) => {

          if (!markdownUrl) {
            debug(`ERROR: no markdown url provided: ${markdownFile}`)
            return data
          }

          if (!fs.existsSync(compiler.options.output.path)) {
            await fsPromises.mkdir(compiler.options.output.path, { recursive: true })
          }

          if (!this.fetched) {

            if (fs.existsSync(markdownFilePath)) fs.unlinkSync(markdownFilePath)

            try {
              await this.downloadFile(markdownUrl, markdownFilePath)

              this.applyMDModifiers(markdownFilePath, this.options.modifiers)

              this.fetched = true

              debug(`Download success: ${markdownFile}`)
            } catch (error) {

              try {
                const fileWriter = fs.createWriteStream(markdownFilePath)
                fileWriter.write('')
                fileWriter.end()
              } finally {
                debug(`Download fail ${markdownFile}`)
              }

            }
          }

          if (!this.generated) {
            try {
              const html = await this.generateMarkdownHTML(markdownFilePath)
              await fsPromises.writeFile(htmlFilePath, html)
              debug(`HTML generation success: ${htmlFile}`)

              const menuhtml = await this.generateMenuHTML(
                htmlFilePath,
                this.options.classes.menuTitle,
                this.options.classes.submenu,
              )
              await fsPromises.writeFile(menuHtmlFilePath, menuhtml)
              debug(`HTML menu generation success: ${menuHtmlFile}`)

              this.generated = true

            } catch (error) {
              debug(`HTML generation fail: ${menuHtmlFile}`)
            }
          }

          const whitePaperHTML = await fsPromises.readFile(htmlFilePath, 'utf8')
          data.html = data.html.replace(tag, whitePaperHTML)

          const whitePaperMenuHTML = await fsPromises.readFile(menuHtmlFilePath, 'utf8')
          data.html = data.html.replace(menuTag, whitePaperMenuHTML)

          return data
        }
      )
    })
  }

  async downloadFile(url, targetFile) {
    return await new Promise((resolve, reject) => {
      https.get(url, response => {
        const code = response.statusCode ?? 0

        if (code >= 400) {
          return reject(new Error(response.statusMessage))
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return resolve(
            this.downloadFile(response.headers.location, targetFile)
          )
        }

        const fileWriter = fs
          .createWriteStream(targetFile, { flags: 'a+' })
          .on('finish', resolve)

        response.pipe(fileWriter)
      }).on('error', reject)
    })
  }

  async generateMarkdownHTML(markdownFilePath) {
    if (!fs.existsSync(markdownFilePath)) return ''

    const md = await fsPromises.readFile(markdownFilePath, 'utf8')
    const converter = new Converter('{{main}}', true)
    const html = converter.convert(md)

    return html
      // Make external links to opened in new tab
      .replace(/href="https:\/\/[^"]*"/g, '$& target="_blank" rel="noopener"')
      // Fix scrolling to anchor by fixing id attributes
      .replace(/id="[^"]*"/ig, (match) => {
        const originaidattr = decodeURIComponent(match).toLowerCase().replace(/[^a-z0-9"=-]/ig, '')
        const originalid = originaidattr.slice(4, -1)
        const id = `${this.options.name.toLowerCase()}-${originalid}`
        const idattr = `id="${id}"`
        return idattr
      })
      // Fix scrolling to anchor by href
      .replace(/href="#[^"]*"/ig, (originalhref) => {
        const originalid = originalhref.toLowerCase().slice(7, -1)
        const id = `${this.options.name.toLowerCase()}-${originalid}`
        const href = `href="#${id}"`
        return href
      })
  }

  async generateMenuHTML(htmlFilePath, titleClass, subTitlesClass) {
    if (!fs.existsSync(htmlFilePath)) return ''
    const markdownhtml = await fsPromises.readFile(htmlFilePath, 'utf8')
    const titles = this.extractTitles(markdownhtml, titleClass)
    const menuScheme = this.getMenuScheme(titles)
    const menuHtml = this.menuSchemeToHtml(menuScheme, subTitlesClass)

    return menuHtml
  }

  getTitleLevel(title = '') {
    return title.match(/data-level="(\d)"/)?.[1]
  }

  getMenuScheme(titles) {
    const scheme = []

    const toptitle = titles[0]
    const toplevel = this.getTitleLevel(toptitle)

    for (let i = 0; i < titles.length; i++) {

      const title = titles[i]
      const level = this.getTitleLevel(title)
      const last = scheme.at(-1)

      if (level === toplevel) {
        scheme.push({ title: title, sub: [] })
      } else {
        last.sub.push(title)

        const nexttitle = titles[i+1]
        const nextlevel = this.getTitleLevel(nexttitle)
        if (!nexttitle || nextlevel === toplevel) {
          last.sub = this.getMenuScheme(last.sub)
        }
      }
    }

    return scheme
  }

  menuSchemeToHtml(scheme, submenuClassName) {
    let result = ''
    for (const title of scheme) {
      result += title.title + '\n'
      if (title.sub.length) {
        const className = submenuClassName ? ` class="${submenuClassName()}"` : ''
        result += `<ul${className}>\n`
        result += this.menuSchemeToHtml(title.sub, submenuClassName)
        result += '</ul>\n'
      }
    }
    return result
  }

  applyMDModifiers(markdownFilePath, modifiers = []) {
    if (modifiers.length == 0) return

    const originalmd = fs.readFileSync(markdownFilePath, 'utf8')
    const modifiedmd = modifiers.reduce((md, modifier) => modifier(md), originalmd)

    fs.writeFileSync(markdownFilePath, modifiedmd, 'utf-8')
  }

  extractTitles(html, titleClass) {
    if (!html) return []
    return html
      .match(/<h\d.+/ig)
      .filter((title) => title.at(2) <= this.options.menuDepth)
      .map(title => title
        .replace(
          /id="[^"]*"/ig,
          (id) => {
            const level = title.at(2)
            const href = id.replace(/id="/, 'href="#')
            const className = `class="${titleClass(level)}"`
            const datalevel = `data-level="${level}"`
            return `${href} ${className} ${datalevel}`
          }
        )
        .replace(/h\d/g, 'a')
      )
  }
}

module.exports = OrcalyMarkdownPlugin