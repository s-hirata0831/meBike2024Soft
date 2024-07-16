// webpack.config.js

module.exports = {
    // 他の設定
    module: {
      rules: [
        // 他のルール
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            // ここに警告を無視するモジュールを追加
            /@googlemaps\/js-api-loader/
          ]
        }
      ]
    }
  };
  