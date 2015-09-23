/*
 * gulp-i18n-csv
 * https://github.com/wet-boew/grunt-i18n-csv
 *
 * Copyright (c) 2014 Laurent Goderre
 * Licensed under the MIT license.
 */

var options;
var results;

module.exports = function (opts) {
    'use strict';
    options = opts;
    results = [];

    return {
        process: function (row) {
            var match;
            var id;
            var value;
            var resultIndex;
            var s;

            for (s = 1; s < row.length; s++) {
                id = row[0];
                value = row[s];
                resultIndex = s - 1;

                if (results[resultIndex] === undefined) {
                    results[resultIndex] = options.templateContent;
                }

                if (value === '' && options.useDefaultOnMissing) {
                    value = row[1];
                }

                //Unescape CSV string
                value = value.replace('\\\'', '\'');

                if (options.ext === '.js' || options.ext === '.json') {
                    value = JSON.stringify(value);
                    value = value.substring(1, value.length - 1);
                }

                match = new RegExp('@' + id + '@', 'g');
                results[resultIndex] = results[resultIndex].replace(match, value);
            }
        },

        complete: function () {
            return results;
        }
    };
};
