const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  runtimeCompiler: true,
  devServer: {
    port: 8080,
  },
  configureWebpack: {
    target: 'electron-renderer',
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "DQS калькулятор",
      },
    },
  },
})
