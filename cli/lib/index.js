'use strict'

let builder = require('./builder');

module.exports = function(argv, callback) {
    if (argv._.length !== 1) {
        return callback("must specify source directory.");
    }

    builder(argv._[0], argv, callback);
};
