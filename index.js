'use strict';
var through = require('through2');
var csvParse = require('csv-parse');
var gutil = require('gulp-util');
var File = require('vinyl');

module.exports = function(options) {
    options = options || {};

    // stringifies JSON and makes it pretty if asked
    function stringify(jsonObj) {
        if (options.pretty) {
            return JSON.stringify(jsonObj, null, 4);
        } else {
            return JSON.stringify(jsonObj);
        }
    }

    function filePath(jsonObj, lang, key) {
        var savePath = '' + options.resPath;
        if (options.resPath) {
            if (key) {
                savePath = savePath.replace('__ns__', key);
            } else {
                savePath = savePath.replace('__ns__', 'translation');
            }

            savePath = savePath.replace('__lng__', lang);
        }

        var jsfile = new File({
            cwd: '.',
            path: savePath, // put each translation file in a folder
            contents: new Buffer(stringify(jsonObj)),
        });

        return jsfile;
    }

    // split language files further into subsections (ie. help) if unused much
    function splitFile(jsonObj, lang) {
        var key;
        var files = [];
        if (options.split) {
            // when true
            if (options.split === true) {
                Object.keys(jsonObj).forEach(function(key) {
                    files.push(filePath(jsonObj[key], lang, key));
                    delete jsonObj[key];
                });
            } else if (typeof options.split === 'string') {
                Object.keys(jsonObj).forEach(function(key) {
                    if (key === options.split) {
                        files.push(filePath(jsonObj[key], lang, key));
                        delete jsonObj[key];
                    }
                });
            } else if (options.split instanceof Array) {
                if (options.split.indexOf(key) !== -1) {
                    files.push(filePath(jsonObj[key], lang, key));
                    delete jsonObj[key];
                }
            }
        }

        if (options.split !== true) {
            files.push(filePath(jsonObj, lang, key));
        }

        return files;
    }

    // parse array to JSON object and write to JSON file
    function parseArray(csvArray, task) {
        for (var i = 2; i < csvArray[0].length; i++) {
            var lang = csvArray[0][i]; // get language from the CSV header row
            var jsonObj = {}; // JSON object to be created

            for (var j = 0; j < csvArray.length; j++) {
                // append to JSON string
                var key = csvArray[j][1];
                var subkeyArray = key.split('.');
                var value = csvArray[j][i];
                var k = 0;
                var node = jsonObj;
                var csvErr = 'CSV poor format. Do not assign string value to key' +
                    ' if there will be more subkeys nested within that key.';

                while (node && (k < subkeyArray.length - 1)) {
                    if (!node[subkeyArray[k]]) {
                        node[subkeyArray[k]] = {};
                    } else {
                        if (typeof node[subkeyArray[k]] !== 'object') {
                            throw csvErr;
                        }
                    }

                    node = node[subkeyArray[k]];
                    k++;
                }

                if (node) {
                    if (!node[subkeyArray[k]]) {
                        node[subkeyArray[k]] = value;
                    } else {
                        if (typeof node[subkeyArray[k]] === 'object') {
                            throw csvErr;
                        }
                    }
                }
            }

            var jsfile = splitFile(jsonObj, lang);

            // do not write files from the gulp plugin itself
            // create a file object and push it back to through stream
            // so main gulpfile
            for (var x = 0; x < jsfile.length; x++) {
                task.push(jsfile[x]);
            }
        }
    }

    return through.obj(function(file, enc, cb) {
        var _this = this; // task is a reference to the through stream

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        // STREAM BLOCK
        if (file.isStream()) {
            var csvArray = [];
            var parser = csvParse();

            parser.on('readable', function() {
                var record = parser.read();
                while (record) {
                    csvArray.push(record);
                    record = parser.read();
                }
            });

            parser.on('error', function(err) {
                //console.log('on error', err.message);
                this.emit('error', new gutil.PluginError('gulp-i18n-csv', err));
            });

            parser.on('finish', function() {
                //console.log('on finish');
                parseArray(csvArray, _this);
                parser.end();
                cb();
            });

            file.contents.pipe(parser);
        } else {
            // BUFFER BLOCK
            try {
                csvParse(file.contents.toString('utf-8'),
                    function(err, output) {
                        parseArray(output, _this);
                        cb();
                    });
            } catch (err) {
                this.emit('error', new gutil.PluginError('gulp-i18n-csv', err));
            }
        }
    });
};
