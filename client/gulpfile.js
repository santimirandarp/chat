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

const dirs = { html:'./src/**/*.html', scss:'./src/public/scss/*.scss', css:'./dist/public/css',
js:'./src/**/*.js'}

// Formatting is done by the text editor (vscode) using the eslint & prettier configs

export function html() { return src(dirs.html).pipe(dest('./dist/')) }

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


export function formatJS() {
    return src(dirs.js)
        .pipe(eslint({ configFile: "./.eslintrc.cjs" }))
        .pipe(eslint.formatEach("compact", process.stderr))
        .pipe(prettier({ config: "./.prettier.config.cjs" }))
        .pipe(dest("./"));
}

// how to add more than one entry ?
export function bundleJS() {
    return src('./src/public/js/chat.js')
        .pipe(
            webpack({
                output: { filename: 'chat.js' },
                node: false,
                mode: 'production',
                devtool: 'inline-source-map',
                entry: './src/public/js/chat.js',
                target:'web'
            })
        )
        .pipe(dest('./dist/public/js'))
}

export function copyCheckbox(){
	return src('./src/public/js/checkbox.js')
		.pipe(dest('./dist/public/js/checkbox.js'))
}

export function watcher(cb) {
    watch('./src/index.html', html)
    watch('./src/sass/*.scss', buildStyles)
    watch('./src/js/*.js', bundleJS)
    cb()
}

export const all = parallel(html, buildStyles, bundleJS, copyCheckbox);
export default watcher;
