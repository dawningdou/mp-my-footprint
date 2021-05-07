const path = require('path')
const fs = require('fs')
const jsonConcat = require('json-concat')
const PostCompile = require('post-compile-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
module.exports = {
  lintOnSave: true,
  configureWebpack: {
    // devServer: {
    //   disableHostCheck: true,
    //   proxy: {
    //     '/xn': {
    //       target: 'https://tapp.wltong.cn',
    //       changeOrigin: true,
    //       logLevel: 'debug',
    //       secure: false,
    //       onProxyRes (proxyRes, req) {
    //         proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin
    //         proxyRes.headers['Access-Control-Allow-Credentials'] = true
    //       }
    //     }
    //   }
    // },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname,'src', 'cloudfunctions'),
            to: path.join(__dirname, 'dist', env, process.env.UNI_PLATFORM, 'cloudfunctions')
          }],
      }),
      new PostCompile(() => {
        const componentsRoot = resolve('src/components')
        const files = []
        function getJsonFile (dir, callback) {
          fs.readdirSync(dir).forEach(function (file) {
            const pathname = path.join(dir, file)
            if (fs.statSync(pathname).isDirectory()) {
              getJsonFile(pathname, callback)
            } else {
              callback(pathname)
            }
          })
        }
        getJsonFile(componentsRoot, (file) => {
          const extname = path.extname(file)
          if (extname.toUpperCase().slice(1) === 'JSON') {
            files.push(file)
          }
        })
        files.forEach((file) => {
          const destFilePath = file.replace(componentsRoot, '')
          const destComponentsRoot = resolve('dist/' + env + '/mp-weixin/components')
          console.log('merge components json files', destFilePath)
          jsonConcat({
            src: file,
            dest: destComponentsRoot + destFilePath
          }, function () {})
        })
      })
    ]
  }
}
