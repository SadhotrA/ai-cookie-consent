const path = require('path');

module.exports = {
    entry: './frontend/widget.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'cookie-consent.min.js',
        library: 'CookieConsentWidget',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}; 