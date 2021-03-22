const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const chokidar = require('chokidar')

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.resolve(rootDir, 'src')
const distDir = path.resolve(rootDir, 'dist')
const samplesDir = path.resolve(rootDir, 'samples')

const htmlPages = []
const indexHtmlContent = []

fs.readdirSync(samplesDir).forEach((filename) => {
  if (/\.html$/i.test(filename)) {
    indexHtmlContent.push(
      `<li><a href="${filename}" target="_blank">${filename}</a></li>`
    )
    htmlPages.push(
      new HtmlWebpackPlugin({
        filename,
        template: samplesDir + '/' + filename,
        inject: 'head',
      })
    )
  }
})

module.exports = {
  entry: {
    jparticles: path.resolve(srcDir, 'index.ts'),
  },
  output: {
    filename: '[name].[hash:8].js',
    path: distDir,
    library: 'JParticles',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': rootDir,
      '@src': srcDir,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  devServer: {
    before(app, server) {
      chokidar.watch([samplesDir]).on('all', () => {
        server.sockWrite(server.sockets, 'content-changed')
      })
    },
    contentBase: distDir,
    host: '127.0.0.1',
    port: 9000,
    hot: true,
    open: true,
    disableHostCheck: true,
    overlay: true,
    clientLogLevel: 'silent',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: `${samplesDir}/css`, to: `${distDir}/css` },
        { from: `${samplesDir}/js`, to: `${distDir}/js` },
        { from: `${samplesDir}/img`, to: `${distDir}/img` },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      templateContent: `
        <html>
          <body>
            <h1>Samples:</h1>
            <ul style="line-height: 2;">${indexHtmlContent.join('')}</ul>
          </body>
        </html>
      `,
    }),
    ...htmlPages,
  ],
}
