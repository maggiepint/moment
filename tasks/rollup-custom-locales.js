var rollup = require('rollup');
var path = require('path');
var babelPlugin = require('rollup-plugin-babel');
var multiEntry = require('rollup-plugin-multi-entry').default;

module.exports = function (grunt) {
    grunt.task.registerTask('rollup-custom-locales', 'bundle custom locales', function (locales) {
        var done = this.async();

        var localeFiles = getLocaleFiles(locales);
        console.log(localeFiles);
        var localesFile = composeLocaleFile(localeFiles, false);
        console.log('locales');
        var momentLocalesFile = composeLocaleFile(localeFiles, true);
        console.log('with moment');

        var localeRollup = rollup.rollup({
            entry: localesFile,
            plugins: [
                babelPlugin({
                    babelrc: false,
                    compact: false,
                    presets: ['es2015-loose-rollup']
                })
            ],
            exports: 'none',
            external: [
                path.resolve(__dirname, '../src/moment.js')
            ],
            globals: {
                '../moment': 'moment'
            }
        });

        var momentWithLocaleRollup = rollup.rollup({
            entry: momentLocalesFile,
            plugins: [
                babelPlugin({
                    babelrc: false,
                    compact: false,
                    presets: ['es2015-loose-rollup']
                })
            ],
            exports: 'default'
        });

        Promise.all([ localeRollup, momentWithLocaleRollup]).then(function (values) {
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
            Promise.all([writeMomentLocales]).then(done, function(val) {
                console.log(val);
                done();
            });
        }, function (value) {
            console.log(value);
        });

        function getLocaleFiles(locales) {
            console.log(locales)
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

        function composeLocaleFile(files, withMoment) {
            console.log(files)
            var importCode = files.map(function (file) {
                    var identifier = path.basename(file, '.js').replace('-', '_');
                   // var fileNoExt = file.replace('.js', '');
                    return 'import ' + identifier + ' from "../../' + file + '";';
                }).join('\n'),
                code = (withMoment) ? 'import moment from "../../src/moment.js";\n\n' +
                    importCode : importCode,
                filePath = (withMoment) ? 'build/temp/moment-with-locales.custom.js' : 'build/temp/locales.custom.js'
            grunt.file.write(filePath, code);
            return filePath;
        }
    });
};


