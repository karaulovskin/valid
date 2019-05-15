'use strict';

const gulp = require('gulp');
const ejs = require("gulp-ejs-monster");
const htmlbeautify = require('gulp-html-beautify');
const svgSprite = require('gulp-svg-sprite');
const webpack = require("webpack-stream");
const imagemin = require('gulp-imagemin');
const rimraf = require('rimraf');
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const argv = require('yargs').argv;
const postcss = require('gulp-postcss');
const postcssPlugins = require('./postcss.config.js');
// const pngquant = require('imagemin-pngquant');

process.env.webpackWatch = argv.production;

const path = {
    build: {
        ejs: './assets/',
        htmlFrom: './assets/**',
        htmlTo: '../../../../html/',
        js: './assets/js/',
        styleVendors: './assets/css/',
        style: './assets/css/',
        img: './assets/images/',
        // fonts: 'assets/fonts/',
        icons: './assets/icons/'
    },
    src: {
        ejs: './app/templates/*.ejs',
        ejsLayouts: './app/layouts/',
        ejsModules: './app/modules/',
        js: './app/app.js',
        style: './app/styles/app.css',
        img: './app/images/**/*.*',
        // fonts: 'src/fonts/**/*.*',
        icons: './app/icons/*.svg'
    },
    watch: {
        ejs: './app/**/*.ejs',
        js: './app/js/**/*.js',
        style: './app/styles/**/*.css',
        img: './app/images/**/*.*',
        // fonts: 'src/fonts/**/*.*',
        icons: './app/icons/*.svg'
    },
    clean: './assets'
};

gulp.task('ejs:build', function () {
    return gulp.src(path.src.ejs)
        .pipe(ejs({
            layouts: path.src.ejsLayouts,
            requires: path.src.ejsModules,
            includes: 'app/'
        }).on('error', ejs.preventCrash))
        .pipe(htmlbeautify({indentSize: 4}))
        .pipe(gulp.dest(path.build.ejs))
});

gulp.task('js:build', function () {
    let config = require('./webpack.config.js');
    return gulp.src(path.src.js)
        .pipe(webpack(config))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest(path.build.style));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('sprite:build', function () {
    return gulp.src(path.src.icons)
        .pipe(svgSprite({
            mode				: {
                symbol			: {
                    prefix: ''
                },
            },
            svg						: {							// General options for created SVG files
                xmlDeclaration		: false,						// Add XML declaration to SVG sprite
                namespaceIDs		: false,						// Add namespace token to all IDs in SVG shapes
                doctypeDeclaration	: false,						// Add DOCTYPE declaration to SVG sprite
                namespaceClassnames	: false,						// Add namespace token to all CSS class names in SVG shapes
                dimensionAttributes	: true						// Width and height attributes on the sprite
            },
            shape				: {
                id				: {
                    generator: 'icon-%s',
                }
                }
            }))
        .pipe(gulp.dest(path.build.icons))
});


gulp.task('webserver', function(){
    browserSync.init({
        server: './assets'
    });
    browserSync.watch('./assets').on('change', browserSync.reload);
});

gulp.task('clean', function (cb) {
    return rimraf(path.clean, cb);
});

gulp.task(
    'build',
    gulp.series(gulp.parallel('ejs:build', 'js:build', 'style:build', 'image:build', 'sprite:build'))
);

gulp.task('watch', function() {
    gulp.watch([path.watch.ejs], gulp.series('ejs:build'));
    gulp.watch([path.watch.style], gulp.series('style:build'));
    gulp.watch([path.watch.js], gulp.series('js:build'));
    gulp.watch([path.watch.img], gulp.series('image:build'));
    gulp.watch([path.watch.icons], gulp.series('sprite:build'));
});

gulp.task(
    'default',
    gulp.series(gulp.parallel('build', 'webserver', 'watch'))
);