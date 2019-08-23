var gulp = require('gulp');
var $ = require('gulp-load-plugins')();//自动写入package.json中插件
var combiner2 = require('stream-combiner2');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');


// js压缩 gulp-uglify    js代码检查 gulp-eslint  jshint
gulp.task('uglify', function(done) {
  gulp.src('src/js/*.js')
    // .pipe($.jshint())
    .pipe($.uglify())
    .pipe(gulp.dest('dest/js'));
  done();
});

// 条件判断 gulp-if
gulp.task('gulpif', function(done) {
  var cond = false;
  gulp.src('src/js/')
    // .pipe($.jshint())
    .pipe(gulpif(cond, $.uglify(), $.concat('all.if.js')))
    .pipe(gulp.dest('dest/js'));
  done();
});

// 整合stream 处理错误 stream-combiner2
gulp.task('combiner', function(done) {
  combiner2.obj([
    gulp.src('src/js/*.js'),
    $.uglify(),
    gulp.dest('dest/js'),
  ]);
  done();
});

// 合并js代码 gulp-concat   重命名js文件： gulp-rename
gulp.task('compress-js', function(done) {
  gulp.src('src/js/*.js')
    .pipe($.concat('all.js'))
    .pipe($.uglify())
    .pipe($.rename('all.min.js'))
    .pipe(gulp.dest('dest/js'));
  done();
});

// css压缩 gulp-minify-css  gulp-cssnano   解析 CSS 文件并且添加浏览器前缀到CSS规则:gulp-autoprefixer
gulp.task('cssnano', function(done) {
  gulp.src('src/css/*.css')
    .pipe($.cssnano())
    // .pipe($.autoprefixer({
    //   browsers: 'last 2 versions'
    // }))
    .pipe(gulp.dest('dest/css'));
  done();
});

// scss转化css，并压缩  gulp-scss
gulp.task('compile-scss', function(done) {
  gulp.src('src/scss/*.scss')
    .pipe($.scss())
    .pipe($.cssnano())
    .pipe(gulp.dest('dest/scss'));
  done();
});

// 图片压缩
gulp.task('zip-image', function(done) {
  gulp.src('src/images/*.{jpg,png,JPG,PNG}')
    .pipe($.imagemin())
    .pipe(gulp.dest('dest/images'));
  done();
});

// 创建本地服务器： gulp-connect
// gulp.task('connect-server',function(){
//     $.connect.server({
//         root:'dist',//服务器的根目录
//         port:8080, //服务器的地址，没有此配置项默认也是 8080
//         livereload:true//启用实时刷新的功能
//     });
// });

//实时预览： gulp-connect
// gulp.task('copy-html',function(){
//     gulp.src('app/index.html')//指定源文件
//         .pipe(gulp.dest('dist'))//拷贝到dist目录
//         .pipe($.connect.reload());//通知浏览器重启
// });


// 清理文件夹 gulp-clean
gulp.task('clean', function(done) {
  console.log('清空 dest 目录下的资源')
  gulp.src('dest/*')
    .pipe($.clean({force: true}));
  done();
})
// 同步执行任务 gulp-sequence

// gulp.task('start', gulp.series(['uglify', 'gulpif', 'combiner', 'compress-js', 'cssnano', 'compile-scss', 'zip-image']))
gulp.task('start', gulp.series(['uglify', 'gulpif', 'combiner', 'compress-js', 'cssnano', 'compile-scss', 'zip-image']))

gulp.task('default', function(done) {
  console.log('default')
  gulp.run($.sequence('clean', 'start'))
  // ;
  gulp.watch('src/js/**.*', gulp.series(['start']));
  done();
})