import gulp from 'gulp'
const { watch, parallel, series, src, dest } = gulp
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'

import sourcemaps from 'gulp-sourcemaps'
import webpack from 'webpack-stream'
const sass = gulpSass(dartSass)

import eslint  from 'gulp-eslint-new';
import prettier from 'gulp-prettier';

const dirs = { 
	html:'./src/**/*.html', 
	scss:'./src/**/*.scss', 
	css:'./dist/public/css',
	js:'./src/**/*.js'
}

export function html() { 
	return src(dirs.html)
		.pipe(dest('./dist/')) 
}

export function buildStyles() {
    return src(dirs.scss)
        .pipe(sourcemaps.init())
        .pipe(
            sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError)
        )
        .pipe(autoprefixer({ cascade: false }))
        .pipe(sourcemaps.write())
        .pipe(dest(dirs.css))
}



/* formatters not running by default, run by hand or in scripts */

// by vscode, this is just manually for random ocassions.
export function prettifySass(){
    return src(dirs.scss)
        .pipe(prettier({ config: "./.prettier.config.cjs" }))
        .pipe(dest("./src"));
}

// by vscode, this is just manually for random ocassions.
export function format() {
    return src([dirs.js, dirs.html])
        .pipe(eslint({ configFile: "./.eslintrc.cjs" }))
        .pipe(eslint.formatEach("compact", process.stderr))
        .pipe(prettier({ config: "./.prettier.config.cjs" }))
        .pipe(dest("./src"));
}

// ======================================================= //


export function bundleJS() {
    return src('./src/public/js/chat.js')
        .pipe(
            webpack({
                output: { filename: 'chat.js' },
                node: false,
                mode: 'production',
                devtool: 'source-map',
                entry: './src/public/js/chat.js',
                target:'web',
            })
        )
        .pipe(dest('./dist/public/js'))
}

export function copyCheckbox(){
	return src('./src/public/js/checkbox.js')
		.pipe(dest('./dist/public/js/'))
}

// in purpose not formatting the files that watches, vim would be confused
export function watcher(cb) {
    watch(dirs.html, html)
    watch(dirs.scss, buildStyles)
    watch(dirs.js, bundleJS)
    watch('./src/public/js/checkbox.js', copyCheckbox)
    cb()
}

export const all = parallel(html, prettifySass, buildStyles, series(format,copyCheckbox,bundleJS));
export default watcher;
