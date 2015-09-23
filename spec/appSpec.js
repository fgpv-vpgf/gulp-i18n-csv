/* jshint jasmine: true */
'use strict';
var File = require('vinyl');
var i18nCsv = require('../');

describe("Buffer mode",function () {

    beforeEach(function() {
        this.plugin = i18nCsv();
    });

    it('should work for a basic En/Fr case', function (cb) {
        var data = new File({contents: new Buffer('headers,lang,en,fr\nuseless notes,key,enval,frval\nuseless notes,key2,enval,frval')});
        var files = [];
        this.plugin.write(data);
        this.plugin.end();
        this.plugin.on('data', function (file) {
            files.push(file);
            try {
                JSON.parse(file.contents);
            } catch (e) {
                fail('Could not parse the generated file');
            }
        });
        this.plugin.on('end', function () {
            expect(files.length).toBe(2);
            cb();
        });

    });

});
