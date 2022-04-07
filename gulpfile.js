const { src, dest, watch , series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const imageminGulp = require('gulp-imagemin'); // Minificar imagenes 
// const imagemin = require('imagemin');
// const imageminAvif = require('imagemin-avif');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

function css( done ) {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        // .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') );
}

function cssbuild( done ) {
    src(paths.scss)
        .pipe( rename({
            suffix: '.min'
        }))
        .pipe( purgecss({
            content: ['index.html']
        }))
        .pipe( dest('build/css'))

    done();
}

function javascript( done ) {
    return src(paths.js)
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
}

function imagenes( done ) {
    return src(paths.imagenes)
        .pipe(cache(imageminGulp({ optimizationLevel: 3})))
        .pipe(dest('build/img'));
}

function imagenesAvif( done ) {
    imagemin([paths.imagenes], {
        destination: 'build/img',
        plugins: [
            imageminAvif({quality: 50})
        ]
    });
}

function versionWebp( done ) {
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe(dest('build/img'));
}


function watchArchivos( done ) {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch( paths.imagenes, imagenes );
    watch( paths.imagenes, versionWebp );
}

exports.css = cssbuild;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript,  imagenes, versionWebp, watchArchivos ); 