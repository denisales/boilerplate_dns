var postcss = require('gulp-postcss')
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var cssnext = require('postcss-cssnext')
var sass = require('gulp-sass')
var mqpacker = require("css-mqpacker")
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var imagemin = require('gulp-imagemin')
var browserSync = require('browser-sync').create()
var htmlrender = require('gulp-htmlrender')
var concat   = require('gulp-concat')
// var fonts2css = require('gulp-fonts2css')

gulp.task('serve', ['styles-pac', 'js-pac', 'image-pac', 'render',], function() {

    browserSync.init({
        server: "./dist"
    });
    gulp.watch("src/assets/scss/**/*.scss", ['styles-pac']);
    gulp.watch("src/assets/js/**/*.js", ['js-pac']);
    gulp.watch("src/assets/img/**/*.jpg", ['image-pac']);
    // gulp.watch("src/assets/fonts/**/*.{otf,ttf,woff,woff2}", ['fonts2css']);
    gulp.watch("src/view/**/*.html", ['render']).on('change', browserSync.reload);
    gulp.watch("dist/view/**/*.html").on('change', browserSync.reload);
});

gulp.task('js-pac', () => {	
	gulp.src('src/assets/js/*.js', {sourcemap: true})
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('image-pac', () =>{
    gulp.src('src/assets/img')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/'));
});

gulp.task('render', () =>{
    gulp.src('src/view/**/index.html', {read: false})
    .pipe(htmlrender.render())
    .pipe(gulp.dest('dist/view'));
});

gulp.task('styles-pac', () => {
	gulp.src('src/assets/scss/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass.sync().on('error', sass.logError))
	.pipe(postcss([ cssnext() ]))
	.pipe(postcss([ autoprefixer() ]))
    .pipe(postcss([ mqpacker() ]))
    .pipe(postcss([ cssnano() ]))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// gulp.task('fonts2css', function() {
//     gulp.src('src/assets/fonts/**/*.{otf,ttf,woff,woff2}')
//    .pipe(fonts2css())
//    //.pipe(concat('_fonts.scss'))
//    .pipe(gulp.dest('src/assets/scss/'));
// });

gulp.task('default', ['serve']);