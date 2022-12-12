const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
   mode: "development",
   devtool: "source-map",
   entry: {
      main: path.resolve(__dirname, "..", "src", "main.ts"),
      background: path.resolve(__dirname,  "..", "src", "background.ts"),
   },
   output: {
      path: path.join(__dirname, "..", "dist"),
      filename: "[name].js",
      clean: true
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [{
            from: path.resolve(__dirname, "..", "src", "manifest.json"),
            to: path.resolve(__dirname, "..", "dist", "manifest.json")
         },
         {
            from: path.resolve(__dirname, "..", "src", "popup.html"),
            to: path.resolve(__dirname, "..", "dist", "popup.html")
         },
         {
            from: path.resolve(__dirname, "..", "src", "React"),
            to: path.resolve(__dirname, "..", "dist", "React")
         },
      ]
      }),
   ]
};