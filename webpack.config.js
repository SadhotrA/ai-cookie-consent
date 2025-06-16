const path = require('path');

module.exports = {
    entry: './frontend/widget.js',
    output: {
        filename: 'cookie-consent.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'cookieConsent',
            type: 'umd',
            export: 'default'
        },
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
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    mode: 'production',
}; 