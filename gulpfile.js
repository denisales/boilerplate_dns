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
var watch = require('gulp-watch')
var cleanDest = require('gulp-clean-dest')
// var concat   = require('gulp-concat')
// var fonts2css = require('gulp-fonts2css')

gulp.task('serve', ['styles-pac', 'image-pac', 'render', 'js-pac',], function() {

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

// minimificar JS
// gulp.task('js-pac', () => {	
// 	gulp.src('src/assets/js/**/*.js', {sourcemap: true})
//     .pipe(sourcemaps.init())
//     .pipe(uglify())
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('dist/js'))
//     .pipe(browserSync.stream());
// });


// minimificar imagens
gulp.task('image-pac', () =>{
    gulp.src('src/assets/img')
    .pipe(watch('src/assets/img'))
    .pipe(imagemin())
    .pipe(cleanDest('dist/'))
    .pipe(gulp.dest('dist/'));
});

// renderizar HTML particionado
gulp.task('render', () =>{
    gulp.src('src/view/**/index.html', {read: false})
    .pipe(htmlrender.render())
    .pipe(gulp.dest('dist/'));
});

// compilar cssnext, compilar sass, minimificar, unir media queries, autoprefixer
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


gulp.task('js-pac', () => {
    gulp.src('src/assets/js/**/*.js')
    .pipe(watch('src/assets/js/**/*.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanDest('dist/js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// gulp.task('stream', () =>{
//     gulp.src('src/assets')
//     .pipe(watch(['src/assets/*', '!src/assets/scss']))
//     .pipe(cleanDest('src/assets'))
//     .pipe(gulp.dest('dist/'));
// });

// gulp.task('fonts2css', function() {
//     gulp.src('src/assets/fonts/**/*.{otf,ttf,woff,woff2}')
//    .pipe(fonts2css())
//    //.pipe(concat('_fonts.scss'))
//    .pipe(gulp.dest('src/assets/scss/'));
// });

gulp.task('default', ['serve']);