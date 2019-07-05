import * as gulp from 'gulp';
import uglifyEs from 'gulp-uglify-es';
import * as typescript from 'gulp-typescript';
import * as replace from 'gulp-replace';
import * as rimraf from 'rimraf';
import * as fsExtra from 'fs-extra';
import * as uglifyCss from 'uglifycss';
import * as sourcemaps from 'gulp-sourcemaps';
import * as liveServer from 'live-server';


function clean(done) {
    rimraf('dist/**/*', {}, done);
}

async function getStyles() {
    let contents = await fsExtra.readFile('src/index.css');
    return uglifyCss.processString(contents.toString());
}

async function build() {
    let styles = getStyles();
    return gulp.src('src/index.ts')
        .pipe(replace('INJECT_STYLES_HERE', await styles))
        .pipe(sourcemaps.init())
        .pipe(typescript({
            target: "es2015",
            declaration: false,
            noEmitHelpers: true,
            moduleResolution: "node"
        }))
        .pipe(uglifyEs())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}

gulp.task('watch', gulp.series(clean, build, function watch() {
    gulp.watch('src/**/*.*', build);
    liveServer.start({
        watch: [
            'dist/index.js',
            'index.html'
        ]
    });
}));
gulp.task('default', gulp.series(
    clean,
    build
));