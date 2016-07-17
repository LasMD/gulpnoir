var gulp    = require('gulp');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var cache = require('gulp-angular-templatecache');
var add = require('add-stream');
var htmlmin = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');
var autoprefixer = require('gulp-autoprefixer');

function buildTemplates() {
	return gulp.src('src/app/**/*.html')
	.pipe(plumber())
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(cache());
}

var fonts = {};
fonts.vendor = [
	'bower_components/font-awesome/fonts/**/*'
];

var scripts = {};
scripts.vendor = [
  'node_modules/angular/angular.js',
  'node_modules/angular-ui-router/release/angular-ui-router.js',
	'node_modules/angular-aria/angular-aria.js',
  'node_modules/angular-animate/angular-animate.js',
  'node_modules/angular-material/angular-material.js',
  'node_modules/angularjs-filters/filters.js',
  'node_modules/ng-lodash/build/ng-lodash.js',
  'node_modules/angular-local-storage/dist/angular-local-storage.js',
  'node_modules/ui-router-extras/release/ct-ui-router-extras.js',
];

scripts.app = [
  'src/app/**/*.js'
];

var styles = {};
styles.vendor = [
  'node_modules/font-awesome/css/font-awesome.css',
  'node_modules/roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss'
  // 'node_modules/angular/angular-csp.css',
];

styles.app = "src/styles/app.scss";
styles.watch = ["src/styles/**/*.scss","src/app/**/*.scss"];

gulp.task('compile:scripts/vendor', function() {
  return gulp.src(scripts.vendor)
  .pipe(plumber())
  .pipe(uglify({mangle: false}))
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('build/js'));
});

gulp.task('compile:scripts/app', function() {
  return gulp.src(scripts.app)
  .pipe(plumber())
  .pipe(add.obj(buildTemplates()))
  .pipe(sourcemaps.init())
	.pipe(concat('app.js'))
	.pipe(ngAnnotate({add: true}))
  .pipe(uglify({mangle: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('build/js'));
});

gulp.task('compile:styles/vendor', function() {
  return gulp.src(styles.vendor)
  .pipe(plumber())
  .pipe(sass({includePaths:['./bower_components']})).on('error', sass.logError)
  .pipe(minifyCss({keepSpecialComments:0, aggressiveMerging: false}))
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('build/css'));
});

gulp.task('compile:styles/app', function() {
  return gulp.src("src/styles/app.scss")
  .pipe(plumber())
  .pipe(sass({includePaths:['./bower_components']})).on('error', sass.logError)
	.pipe(autoprefixer())
  .pipe(minifyCss({keepSpecialComments:0, aggressiveMerging: false}))
  .pipe(gulp.dest('build/css'));
});

gulp.task('compile:images', function() {
  return gulp.src('src/images/**/**')
  .pipe(gulp.dest('build/images'));
});

gulp.task('compile:fonts', function() {
  return gulp.src(fonts.vendor)
  .pipe(gulp.dest('build/fonts'));
});

gulp.task('compile:root', function() {
  return gulp.src('src/root/**/**')
  .pipe(gulp.dest('build'));
});


gulp.task('default', [
    'compile:scripts/vendor',
    'compile:scripts/app',
    'compile:styles/vendor',
    'compile:styles/app',
    'compile:images',
    'compile:fonts',
    'compile:root'
]);
