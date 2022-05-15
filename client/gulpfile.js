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

function html() {
    return src('./src/**/*.html').pipe(dest('./dist/'))
}

function buildStyles() {
    return src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError)
        )
        .pipe(autoprefixer({ cascade: false }))
        .pipe(sourcemaps.write())
        .pipe(dest('./dist/'))
}

function bundleJS() {
    return src('./src/js/entry.js')
        .pipe(eslint({ configFile: "./.eslintrc.cjs" }))
        .pipe(eslint.formatEach("compact", process.stderr))
        .pipe(prettier({ config: "./.prettier.config.cjs" }))
        .pipe(
            webpack({
                output: { filename: 'bundle.js' },
                node: false,
                mode: 'production',
                devtool: 'inline-source-map',
                entry: './src/js/entry.js',
                target:'web'
            })
        )
        .pipe(dest('./dist'))
}

function watcher(cb) {
    watch('./src/index.html', html)
    watch('./src/sass/*.scss', buildStyles)
    watch('./src/js/*.js', bundleJS)
    cb()
}

export const all = parallel(html, buildStyles, bundleJS);
export bundleJS;
export default watcher;
