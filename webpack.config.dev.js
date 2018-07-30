const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
	mode: 'development',
	entry: {
		app: './public/app/index.tsx',
		iris: './public/iris/index.tsx',
		index: './public/landing/index.tsx',
	},
	devtool: 'inline-source-map',
	plugins: [
		new CleanWebpackPlugin(['dist/public']),
		new HtmlWebpackPlugin({
			title: 'CTTS',
			inject: 'body',
			template: 'public/index.html',
			chunks: ['app'],
			filename: 'app.html',
		}),		
		new HtmlWebpackPlugin({
			title: 'CTTS',
			inject: 'body',
			template: 'public/index.html',
			chunks: ['iris'],
			filename: 'iris.html',
		}),
		new HtmlWebpackPlugin({
			title: 'Landing',
			inject: 'body',
			template: 'public/index.html',
			chunks: ['index'],
			filename: 'index.html',
		}),
		new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "public.tsconfig.json",
            }
          }
        ],
			},
			{
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
	},
	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist/public'),
	},
};
