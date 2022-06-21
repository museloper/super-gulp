import gulp from "gulp";
import gulp_pug from "gulp-pug";
import del from "del";

const routes = {
  pug: {
    src: "src/*.pug",
    dest: "build",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gulp_pug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

// export를 해야만 console 혹은 package.json에서 사용 가능하다.
export const dev = gulp.series([prepare, assets]);
