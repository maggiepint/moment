var rollup = require('rollup');
var path = require('path');
var babelPlugin = require('rollup-plugin-babel');
var multiEntry = require('rollup-plugin-multi-entry').default;

module.exports = function (grunt) {
    grunt.task.registerTask('rollup-with-locales', 'bundle moment with locales', function () {
        var done = this.async();

        var files = localeFiles,
    importCode = files.map(function (file) {
        var identifier = path.basename(file, '.js').replace('-', '_');
        var fileNoExt = file.replace('.js', '');
        return 'import ' + identifier + ' from "./' + fileNoExt + '";';
    }).join('\n'),
    code = 'import * as moment_export from "./moment";\n\n' +
        importCode + '\n\n' +
        'export default moment_export;';
        rollup.rollup({
            entry: ,
            plugins: [
                babelPlugin({
                    babelrc: false,
                    compact: false,
                    presets: ['es2015-loose-rollup']
                })
            ],
            exports: 'named'
        }).then(function (bundle) {
           return bundle.write({
                format: 'umd',
                moduleName: 'moment',
                dest: 'build/umd/min/moment-with-locales.js'
            });
        }).then(done, done);

    });
};


