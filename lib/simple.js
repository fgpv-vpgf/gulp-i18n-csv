/*
 * gulp-i18n-csv
 * https://github.com/wet-boew/grunt-i18n-csv
 *
 * Copyright (c) 2014 Laurent Goderre
 * Licensed under the MIT license.
 */

var options;
var results;

module.exports =  function (opts) {
    'use strict';
    options = opts;
    if (options.format !== 'json' && options.format !== 'yaml') {
        throw 'Unknown format : \'' + options.format + '\'';
    }

    results = [];

    return {
        process: function (row) {
            var s;
            var id;
            var value;
            var resultIndex;

            for (s = 1; s < row.length; s++) {
                id = row[0];
                value = row[s];
                resultIndex = s - 1;

                if (results[resultIndex] === undefined) {
                    results[resultIndex] = '';
                }

                if (value === '' && options.useDefaultOnMissing) {
                    value = row[1];
                }

                //Unescape CSV string
                value = value.replace('\\\'', '\'');

                if (options.format === 'json') {
                    results[resultIndex] += '"' + id + '":' + JSON.stringify(value) + ',\n';
                } else if (options.format === 'yaml') {
                    results[resultIndex] += id + ': ' + value + '\n';
                }
            }
        },

        complete: function () {
            if (options.format === 'json') {
                results.forEach(function (r, index, arr) {
                    arr[index] = '{\n' + r.substr(0, r.length - 2) + '\n}';
                });
            }

            return results;
        },
    };
};
