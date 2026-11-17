// webpack.config.js
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Exported as a function so webpack passes in the CLI options (argv).
// `npm run build` sets --mode production, `npm run dev` falls back to development.
export default (env, argv) => ({
  mode: argv.mode || 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, 'dist'),
    clean: true,
  },
  // Source maps only in development: they help debugging but make the bundle much bigger
  devtool: argv.mode === 'production' ? false : 'eval-source-map',
  devServer: {
    watchFiles: ['./src/template.html'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/i,
        use: ['html-loader'],
      },
    ],
  },
});
