'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglyfly = require('gulp-uglyfly');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const del = require('del');
const browserSync = require('browser-sync').create();

gulp.task('minCSS', () => {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass())
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('minJS', () => {
	return gulp.src('./src/js/*.js')
		.pipe(uglyfly())
		.pipe(rename('scripts.min.css'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('minImg', () => {
    gulp.src('./src/img/**/*')
        .pipe(imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('del', () => {
    return del.sync('dist');
});

gulp.task('build:dist', ['del', 'minCSS', 'minJS', 'minImg'], () => {
    gulp.dest('dist');
});

gulp.task('server', () => {
   browserSync.init({
       server: ''
   });

   gulp.watch('./src/scss/**/*.scss', ['minCSS']).on('change', browserSync.reload);
   gulp.watch('./*.html').on('change', browserSync.reload);
   gulp.watch('./src/img/**/*.*', ['minImg']).on('change', browserSync.reload);
   gulp.watch('./src/js/*.js', ['minJS']).on('change', browserSync.reload);
});

gulp.task('run server', ['server']);