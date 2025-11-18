const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat'); // Añadido para corregir el error
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

// Tarea para compilar Sass a CSS
gulp.task('sass', () => {
  return gulp.src('src/sass/**/*.{sass,scss}')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env'], // Transpila ES6+ a ES5
      plugins: ['@babel/plugin-transform-modules-umd'] // Transforma módulos a UMD
    }))
    .pipe(concat('bundle.js')) // Concatenar todos los archivos JS en uno solo
    .pipe(uglify()) // Comprimir el archivo JS
    .pipe(rename({ suffix: '.min' })) // Renombrar el archivo comprimido
    .pipe(gulp.dest('public/js'));
});

gulp.task('css', () => {
  return gulp.src('src/sass/**/*.{sass,scss}')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS()) // Comprimir el CSS
    .pipe(rename({ suffix: '.min' })) // Renombrar el archivo comprimido
    .pipe(gulp.dest('public/css'));
});


// Observar cambios en los archivos Sass y JS
gulp.task('watch', () => {
  gulp.watch('src/sass/**/*.sass', gulp.series('sass', 'css'));
  gulp.watch('src/js/**/*.js', gulp.series('scripts'));
});

// Tarea por defecto que ejecuta todas las tareas
gulp.task('default', gulp.parallel('sass', 'css', 'scripts', 'watch'));
