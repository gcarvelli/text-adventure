const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

var webConfig = {
    entry: './src/web.js',
    target: 'web',
    output: {
        path: path.join(__dirname, 'build/'),
        filename: './js/web.js'
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
                exclude: [
                    path.resolve(__dirname, './test/'),
                    path.resolve(__dirname, './node_modules/')
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "*.html" },
            { from: "House-Explorer.json" },
            { from: "css/", to: "css/" },
            { from: "node_modules/xterm/dist/", to: "xterm" }
        ])
    ],
    // https://github.com/webpack-contrib/css-loader/issues/447
    node: {
        fs: 'empty'
    }
};

var cliConfig = {
    entry: './src/cli.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build/'),
        filename: './js/cli.js'
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
                exclude: [
                    path.resolve(__dirname, './test/'),
                    path.resolve(__dirname, './node_modules/')
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "*.html" },
            { from: "House-Explorer.json" },
            { from: "css/", to: "css/" }
        ])
    ],
    // https://github.com/webpack-contrib/css-loader/issues/447
    node: {
        fs: 'empty'
    }
}

module.exports = [webConfig, cliConfig];
