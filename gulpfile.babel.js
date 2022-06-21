import gulp from "gulp";
import gulp_pug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gulp_image from "gulp-image";
import gulp_sass from "gulp-sass";
import node_sass from "node-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import Babelify from "babelify";

const sass = gulp_sass(node_sass); // gulp-sass 5.0 버전에서 문법이 변경 되었다

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gulp_pug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const img = () =>
  gulp.src(routes.img.src).pipe(gulp_image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
      })
    )
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          Babelify.configure({
            presets: ["@babel/preset-env"],
          }),
          [
            "uglifyify",
            {
              global: true,
            },
          ],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const postDev = gulp.parallel([webserver, watch]);

// export를 해야만 console 혹은 package.json에서 사용 가능하다.
export const dev = gulp.series([prepare, assets, postDev]);
