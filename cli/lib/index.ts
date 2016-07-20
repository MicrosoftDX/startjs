import * as builder from './builder';

module.exports = function(argv: any, callback: (string?) => void) {
    if (argv._.length !== 1) {
        return callback("must specify source directory.");
    }

    builder.build(argv._[0], argv, callback);
};
