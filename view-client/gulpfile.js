var gulp = require('gulp'),
	react = require('gulp-react');

gulp.task('build', ['jsx']);

gulp.task('jsx', function() {
	console.log('jsx task debugger');
});