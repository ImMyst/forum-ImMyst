//JS

const gulp = require ('gulp');
const sass = require ('gulp-sass');
const browserSync = require ('browser-sync');
const concat = require('gulp-concat');
const minify = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

// Convert all sass files to css

gulp.task('sass', function() {
  return gulp.src('public/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
      stream: true
    }))
});


gulp.task('watch', ['sass'], function(){
  gulp.watch('public/scss/**/*.scss', ['sass']);
  gulp.watch('views/*pug');
});


// gulp.task('browserSync', function() {
//   browserSync({
//     server: {
//       baseDir: 'public'
//     },
//   })
// })


gulp.task('css', function(){
   gulp.src('public/css/*.css')
   .pipe(concat('styles.css'))
   .pipe(minify())
   .pipe(gulp.dest('build/styles/'));
});
