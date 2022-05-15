import gulp from "gulp";
const { watch, src, dest, series } = gulp;
import eslint from "gulp-eslint-new";
import prettier from "gulp-prettier";

const files = ["**/*.js", "!node_modules/**", "!client/**"];

function formatJS() {
    return src(files)
        .pipe(eslint({ configFile: "./.eslintrc.cjs" }))
        .pipe(eslint.formatEach("compact", process.stderr))
        .pipe(prettier({ config: "./.prettier.config.cjs" }))
        .pipe(dest("./"));
}
function watcher(cb) {
    watch(files, formatJS);
    cb();
}
export default series(formatJS, watcher);
