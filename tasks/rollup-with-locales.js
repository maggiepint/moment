// var rollup = require('rollup');
// var path = require('path');
// var babelPlugin = require('rollup-plugin-babel');
// var multiEntry = require('rollup-plugin-multi-entry').default;

// module.exports = function (grunt) {
//     grunt.task.registerTask('rollup-with-locales', 'bundle moment with locales', function () {
//         var done = this.async();



//     grunt.file.write()

//         rollup.rollup({
//             entry: ,
//             plugins: [
//                 babelPlugin({
//                     babelrc: false,
//                     compact: false,
//                     presets: ['es2015-loose-rollup']
//                 })
//             ],
//             exports: 'named'
//         }).then(function (bundle) {
//            return bundle.write({
//                 format: 'umd',
//                 moduleName: 'moment',
//                 dest: 'build/umd/min/moment-with-locales.js'
//             });
//         }).then(done, done);

//     });
// };


