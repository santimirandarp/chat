import gulp from "gulp";
const { watch, src, dest, series } = gulp;
import eslint from "gulp-eslint-new";
import prettier from "gulp-prettier";

const files = ["**/*.js", "!node_modules/**", "!client/**"];

// if we use vscode this is automatic,
// otherwise we can run it when we are pissed off
// also done in a precommit automatically using hooks
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
