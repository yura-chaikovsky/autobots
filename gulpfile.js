'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	react = require('gulp-react');

var path = {
	build: {
		css: './view-client/css'
	},
	src: {
		js: './src/js/main.js',
		style: './src/style/main.scss'
	}
};

gulp.task('style-app', function () {
	gulp.src(path.src.style)
		.pipe(sass())
		.pipe(gulp.dest(path.build.css));
});