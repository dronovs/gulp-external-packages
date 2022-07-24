'use strict';

const {src, dest, series} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create()


const pugCompile = () => {
    return src(`src/pug/*.pug`)
        .pipe(pug({pretty: true}))
        .pipe(dest('build/'))
        .pipe(browserSync.stream())
}

const sassCompile = () => {
    return src(`src/scss/style.scss`)
        .pipe(sass({outputStyle: 'compressed'})
            .on("error", console.error.bind(console)))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('build/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(csso({
            restructure: true,
            sourceMap: true,
            debug: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('build/css/'))
        .pipe(browserSync.stream())
}

const browserSyncJob = () => {
    browserSync.init({
        server: "build/"
    });
};

exports.html = pugCompile;
// exports.css = sassCompile;
// exports.server = browserSyncJob;
exports.render = series(pugCompile, sassCompile, browserSyncJob);