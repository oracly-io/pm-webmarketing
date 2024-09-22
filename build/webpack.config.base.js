const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default

const path = require('path')
const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const HtmlWebpackStaticI18nPlugin = require('./utils/HtmlWebpackStaticI18nPlugin')
const OrcalyMarkdownPlugin = require('./utils/OrcalyMarkdownPlugin')

const config = require('./config')

const projectRoot = path.resolve(__dirname, '../')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const appTypeName = config.applicationType
const appTypeConfig = config[appTypeName] || {}

const baseOrcalyMarkdownPluginOptions = {
  menuDepth: 3,
  classes: {
    menuTitle: (level) => `documentation__menu-item documentation__menu-item--${level}`,
    submenu: () => 'documentation__menu-sub-menu',
  },
}
const docsOrcalyMarkdownPluginOptions = {
  menuDepth: 2,
  modifiers: [
    (md) => md
      .replace(/^# .*\n?/gm, '')
      .replace(/^(#+)(.*)$/gm, (match, p1, p2) => `${p1.slice(1)}${p2}`)
  ]
}

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    app: projectRoot + '/src/boot/app.js'
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: config.outputPath,
    publicPath: config.outputPublicPath,
    filename: config.outputFilename,
    chunkFilename: config.outputChunkFilename
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    // new CleanWebpackPlugin(),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'PariMarket Web Trading Platform',
      // favicon: config.faviconPath,
      filename: path.join(config.locale, config.htmlOutputFilename),
      template: config.htmlTemplatePath,
      templateParameters: config.templateParameters,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'auto',
      meta: {
        ...appTypeConfig['meta']
      }
    }),

    new HtmlWebpackStaticI18nPlugin({
      filename: config.htmlOutputFilename,
      locale: config.locale,
      locales: config.locales,
      localesPath: config.localesPath,
      outputDir: config.outputPath,
      allowHtml: true,
      nsSeparator: ':::',
      keySeparator: '::',
    }),

    new OrcalyMarkdownPlugin({
      name: 'WhitePaper',
      markdownUrl: config.markdown_urls.WhitePaper,
      ...baseOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'OraclyV1',
      markdownUrl: config.markdown_urls.OraclyV1,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'OraclyV1Core',
      markdownUrl: config.markdown_urls.OraclyV1Core,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'MetaOraclyV1',
      markdownUrl: config.markdown_urls.MetaOraclyV1,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'Game',
      markdownUrl: config.markdown_urls.Game,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'Round',
      markdownUrl: config.markdown_urls.Round,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'Prediction',
      markdownUrl: config.markdown_urls.Prediction,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'Price',
      markdownUrl: config.markdown_urls.Price,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'EOutcome',
      markdownUrl: config.markdown_urls.EOutcome,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'StakingOraclyV1',
      markdownUrl: config.markdown_urls.StakingOraclyV1,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'Deposit',
      markdownUrl: config.markdown_urls.Deposit,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'Epoch',
      markdownUrl: config.markdown_urls.Epoch,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'MentoringOraclyV1',
      markdownUrl: config.markdown_urls.MentoringOraclyV1,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'ORCY',
      markdownUrl: config.markdown_urls.ORCY,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'DEMO',
      markdownUrl: config.markdown_urls.DEMO,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),
    new OrcalyMarkdownPlugin({
      name: 'VestingOraclyV1',
      markdownUrl: config.markdown_urls.VestingOraclyV1,
      ...baseOrcalyMarkdownPluginOptions,
      ...docsOrcalyMarkdownPluginOptions,
    }),

    new MiniCssExtractPlugin({
      filename: config.cssOutputFilename
    }),

    new webpack.DefinePlugin(config.replaceConfig),

    new ESLintPlugin({
      extensions: ['js'],
    }),

    new WatchExternalFilesPlugin({
      files: [
        config.localesPath + '/**/*.json',
      ]
    })
  ],

  optimization: {
    emitOnErrors: false,
    minimize: false,
    splitChunks: {
      cacheGroups: {
        default: {
          priority: 1
        },
        vendors: {
          test: /[\\/]node_modules[\\/].*\.js$/,
          priority: 2,
          name: 'vendor',
          chunks: 'all'
        },
        objects: {
          test: /.*\.json$/,
          priority: 3,
          name: 'json',
          chunks: 'all'
        },
      }
    }
  },

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        include: projectRoot,
        exclude: /node_modules/,
      },

      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                mode: 'local',
                auto: true,
                exportGlobals: true,
                exportOnlyLocals: false,
                localIdentName: '[local]-[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'src'),
                localIdentHashSalt: 'M'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [autoprefixer(), cssnano()]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      // Images: Copy video files to build folder
      {
        test: /\.(?:mp4|webm)$/i,
        type: 'asset',
        generator: {
          filename: 'videos/[name].[hash:7][ext]'
        }
      },
      // Images: Copy image files to build folder
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:7][ext]'
        }
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
        type: 'javascript/auto',
        generator: {
          filename: 'img/[name].[hash:7][ext]'
        }
      },
      // Fonts inline files
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[hash:7][ext]'
        }
      }
    ],
  },

  resolve: {
    modules: [projectRoot, 'node_modules'],
    extensions: [
      '.js', '.json', '.css', '.scss', '.sass',
      '.svg', '.png', '.jpeg', '.gif'
    ],
    alias: {
      '@': projectRoot + '/src',
      '@static': projectRoot + '/static',
      '@state': projectRoot + '/src/state',
      '@asynchronous': projectRoot + '/src/asynchronous',
      '@constants': projectRoot + '/src/constants',
      '@lib': projectRoot + '/src/lib',
      '@config': projectRoot + '/src/config',
      '@languages': projectRoot + '/src/languages',
      '@styles': projectRoot + '/src/styles',
      '@utils': projectRoot + '/src/utils',
      '@boot': projectRoot + '/src/boot',
      '@data': projectRoot + '/src/data',
      '@features': projectRoot + '/src/features',
    }
  },
}
