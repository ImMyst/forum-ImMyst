//JS

const gulp = require ('gulp');
const sass = require ('gulp-sass');
const browserSync = require ('browser-sync');
const concat = require('gulp-concat');
const minify = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const exec = require('child_process').exec;

// Convert all sass files to css

gulp.task('sass', function() {
  return gulp.src('public/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
      stream: true
    });


gulp.task('watch', ['sass'], function(){
  gulp.watch('public/scss/**/*.scss', ['sass']);
  gulp.watch('views/*pug');
});

gulp.task('server', (cb) => {
    exec('npm start', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('css', function(){
   gulp.src('public/css/*.css')
   .pipe(concat('styles.css'))
   .pipe(minify())
   .pipe(gulp.dest('build/styles/'));
});

gulp.task("default", function () {
  gulp.start("server");
  gulp.start("watch");
  gulp.start("sass");
});
