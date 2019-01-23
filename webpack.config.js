const webpack = require('webpack');
const path = require('path')
console.log('---------------------------------------------')
module.exports = {
    mode: "production",
    entry: './packages/index.js',
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'vue-savedata.umd.js',
      libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [
                  path.resolve(__dirname, "packages")
                ],
                // exclude: [
                //   path.resolve(__dirname, "app/demo-files")
                // ],
                // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
                // test 和 include 具有相同的作用，都是必须匹配选项
                // exclude 是必不匹配选项（优先于 test 和 include）
                // 最佳实践：
                // - 只在 test 和 文件名匹配 中使用正则表达式
                // - 在 include 和 exclude 中使用绝对路径数组
                // - 尽量避免 exclude，更倾向于使用 include
        
                // issuer: { test, include, exclude },
                // issuer 条件（导入源）
        
                enforce: "pre",
                enforce: "post",
                // 标识应用这些规则，即使规则覆盖（高级选项）
        
                loader: "babel-loader",
                // 应该应用的 loader，它相对上下文解析
                // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
                // 查看 webpack 1 升级指南。
        
                options: {
                  presets: ['@babel/preset-env'] // babel预设
                },
                // loader 的可选项
              },
        ]
    },
    plugins: [
          // 构建优化插件
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     filename: 'vendor-[hash].min.js',
        // }),
    ]
  };