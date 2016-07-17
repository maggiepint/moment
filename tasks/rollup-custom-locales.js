var rollup = require('rollup');
var path = require('path');
var babelPlugin = require('rollup-plugin-babel');
var multiEntry = require('rollup-plugin-multi-entry').default;

module.exports = function (grunt) {
    grunt.task.registerTask('rollup-custom-locales', 'bundle custom locales', function (locales) {
        var done = this.async();

        var localeFiles = getLocaleFiles(locales);

        var localeRollup = rollup.rollup({
            entry: localeFiles,
            plugins: [
                multiEntry(),
                babelPlugin({
                    babelrc: false,
                    compact: false,
                    presets: ['es2015-loose-rollup']
                })
            ],
            external: [
                    path.resolve(__dirname, '../src/moment.js')
                ],
            globals: {
                    '../moment': 'moment'
                },
            exports: 'none'
        });

        var localeFilesMoment = getLocaleFiles(locales);

        localeFilesMoment.push('src/moment.js');
        var momentWithLocaleRollup = rollup.rollup({
            entry: localeFilesMoment,
            plugins: [
                multiEntry(),
                babelPlugin({
                    babelrc: false,
                    compact: false,
                    presets: ['es2015-loose-rollup']
                })
            ],
            exports: 'default'
        });

        Promise.all([localeRollup, momentWithLocaleRollup]).then(function (values) {
            var writeLocales = values[0].write({
                format: 'umd',
                moduleName: 'locales',
                dest: 'build/umd/min/locales.custom.js'
            });
            var writeMomentLocales = values[1].write({
                format: 'umd',
                moduleName: 'moment',
                dest: 'build/umd/min/moment-with-locales.custom.js'
            });
            Promise.all([writeLocales, writeMomentLocales]).then(done, function(val) {
                console.log(val);
                done();
            });
        }, function (value) {
            console.log(value);
        });

        function getLocaleFiles(locales) {
            return locales.split(',').map(function (locale) {
                    var file = grunt.file.expand({cwd: 'src'}, 'locale/' + locale + '.js');
                    if (file.length !== 1) {
                        // we failed to find a locale
                        done(new Error('could not find locale: ' + locale));
                        done = null;
                    } else {
                        return 'src/' + file[0];
                    }
                });
        }
    });
};


