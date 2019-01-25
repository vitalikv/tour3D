var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {
  gulp.src(['README.md', 'uiAPI.js'], { read: false })
    .pipe(jsdoc(cb));
});
