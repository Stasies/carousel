const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  entry: {
    experiment: "./src/experiment.ts",
    carousel: "./src/carousel.ts",
    slide: "./src/slide.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "src"), // Serve files from the src directory
    hot: true, // Enable hot reloading
    open: true, // Auto-open browser
    port: 3000, // Port to run the server
  },
};
