// jest-script-preprocessor.js
var babelJest = require("babel-jest");

module.exports = {
  process: function(src, filename) {
    /**
     * Webpack allows directly importing static resource files like stylesheets
     * we need to skip anything that isn't javascript
     */
    if (filename.match(/\.jsx?$/)) {
        return babelJest.process(src, filename);
    } else {
        return '';
    }
  }
};
