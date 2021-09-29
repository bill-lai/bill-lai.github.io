const configFactory = require('../config/webpack.config');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
console.log(configFactory('production'))