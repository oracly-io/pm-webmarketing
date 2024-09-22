const _ = require('lodash')
const path = require('path')

const projectRoot = path.resolve(__dirname, '../')

let outputRoot = process.env.NPM_BUILD_OUTPUT_PATH || path.resolve(__dirname, '../dist')
if (!path.isAbsolute(outputRoot)) {
  outputRoot = path.resolve(outputRoot)
}

const contentPublicPath = process.env.CONTENT_PUBLIC_PATH || '/'

const debug = require('debug')('pm:build:config')

const analyticsEnabled = process.env.ANALYTICS_ENABLED === 'true'
const locizeDevMode = process.env.LOCIZE_DEV_MODE === 'true'
const selfHosted = process.env.HOSTED === 'true'
const watchFiles = process.env.WATCH_FILES === 'true'
const buildSizeReport = process.env.BUILD_BUNDLE_REPORT === 'true'
const buildSizeReportDebug = process.env.BUILD_BUNDLE_REPORT_DEBUG === 'true'

const locale = process.env.LOCALE || 'en'
const locales = process.env.LOCALES ? process.env.LOCALES.split(',') : ['en']

const baseMarkdownUrl = _.trim(process.env.CONTRACTS_DOCUMENTATION_URL, '/')

const _configs = {
  default: {
    cssOutputFilename: 'css/[name].css',
    htmlOutputFilename: 'index.html',
    faviconPath: projectRoot + '/static/images/favicon.ico',
    outputPath: outputRoot,
    outputPublicPath: contentPublicPath,
    outputFilename: 'js/[name].js',
    outputChunkFilename: 'js/[name].js',
    inlineCss: false,
    htmlTemplatePath: projectRoot + '/src/index.ejs',
    templateParameters: require(projectRoot + '/src/data/index.js'),
    locale,
    locales,
    localesPath: projectRoot + '/src/languages',

    watchFiles: watchFiles,
    selfhostApplication: selfHosted,
    port: process.env.PORT || 8804,

    buildSizeReport: buildSizeReport,
    buildSizeReportPath: '/size-report',
    buildSizeReportWebpackConfigPath: './webpack.config.size.report',
    buildSizeReportDebug: buildSizeReportDebug,

    markdown_urls: {
      WhitePaper: process.env.WHITE_PAPER_MARKDOWN_URL,
      OraclyV1: baseMarkdownUrl + '/predicting/OraclyV1.md',
      OraclyV1Core: baseMarkdownUrl + '/predicting/OraclyV1Core.md',
      MetaOraclyV1: baseMarkdownUrl + '/predicting/MetaOraclyV1.md',
      Game: baseMarkdownUrl + '/predicting/structs/Game.md',
      Round: baseMarkdownUrl + '/predicting/structs/Round.md',
      Prediction: baseMarkdownUrl + '/predicting/structs/Prediction.md',
      Price: baseMarkdownUrl + '/predicting/structs/Price.md',
      EOutcome: baseMarkdownUrl + '/predicting/EOutcome.md',
      StakingOraclyV1: baseMarkdownUrl + '/staking/StakingOraclyV1.md',
      Deposit: baseMarkdownUrl + '/staking/structs/Deposit.md',
      Epoch: baseMarkdownUrl + '/staking/structs/Epoch.md',
      MentoringOraclyV1: baseMarkdownUrl + '/mentoring/MentoringOraclyV1.md',
      ORCY: baseMarkdownUrl + '/token/ORCY.md',
      DEMO: baseMarkdownUrl + '/token/DEMO.md',
      VestingOraclyV1: baseMarkdownUrl + '/vesting/VestingOraclyV1.md',
    },

    // NOTE: this used to pass configuration to runtime app.js
    replaceConfig: {
      'process.env': {
        ANALYTICS_ENABLED: `${analyticsEnabled}`,
        LOCIZE_PROJECT_ID: `"${process.env.LOCIZE_PROJECT_ID}"`,
        LOCIZE_API_KEY: `"${process.env.LOCIZE_API_KEY}"`,
        NODE_ENV: `"${process.env.NODE_ENV}"`,
        DEBUG: `"${process.env.DEBUG}"`,
        LOCIZE_DEV_MODE: `"${process.env.LOCIZE_DEV_MODE}"`,
        LOCALE: `"${process.env.LOCALE}"`,
        LOCALES: `"${process.env.LOCALES}"`,
        WEBAPI_URL: `"${process.env.WEBAPI_URL}"`,
      },
    }
  },
  development: {
    webpackConfigPath: './webpack.config.dev'
  },
  production: {
    webpackConfigPath: './webpack.config.prod'
  }
}

if (!_configs[process.env.NODE_ENV]) {
  throw new Error(`Could not find configuration for ${process.env.NODE_ENV}`)
}

const config = _.defaults(
  {},
  _configs[process.env.NODE_ENV],
  _configs.default)

debug(config)

module.exports = config
