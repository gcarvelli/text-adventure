var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'build/'),
        filename: './js/bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        plugins: [
            new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
        ]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "*.html" },
            { from: "House_Explorer.json" },
            { from: "css/", to: "css/" },
        ])
    ]
}
