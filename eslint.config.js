const baseConfig = require(require.resolve('./packages/config/.eslintrc.base.js', { paths: [__dirname] }));
module.exports = [...baseConfig]; 