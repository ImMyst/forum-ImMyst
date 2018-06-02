//JS

const gulp = require ('gulp');
const sass = require ('gulp-sass');
const exec = require('child_process').exec;

// Convert all sass files to css

gulp.task('sass', function() {
  return gulp.src('public/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
      stream: true
    });


gulp.task('watch', ['sass'], function(){
  gulp.watch('public/sass/**/*.scss', ['sass']);
  gulp.watch('views/*pug');
});

gulp.task('server', (callback) => {
    exec('npm start', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
})

gulp.task("default", function () {
  gulp.start("server");
  gulp.start("watch");
  gulp.start("sass");
});
