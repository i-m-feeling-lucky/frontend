module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  chainWebpack: (config) => {
    config.externals({
      jquery: 'jQuery',
      drawingboard: 'DrawingBoard',
    });
  },
};
