'use strict';
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('jshint-stylish');

require('gulp-help')(gulp);

gulp.task('check', function () {
    return gulp
        .src(['*.js', 'lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs());
});

gulp.task('test', 'Run unit tests in jasmine', function () {
    return gulp
        .src('spec/*Spec.js')
        .pipe(jasmine());
});

gulp.task('default', 'Check style and unit tests', ['check','test']);
