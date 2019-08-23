# gulp

目录
[toc]

[gulp官网](https://www.gulpjs.com.cn/)

*gulpjs是一个前端构建工具，与gruntjs相比，gulpjs无需写一大堆繁杂的配置参数，API也非常简单，学习起来很容易，而且gulpjs使用的是nodejs中stream来读取和操作数据，其速度更快*
*gulp 4.0版本后gulp.task('default',gulp.series(['script']))，必须用gulp.series*

## 使用案例
[常用gulpfile.js配置](https://github.com/zhangwen0424/glup-test/gulpfile.js)

## 安装
glup卸载：npm rm --global gulp  
1.安装：node、npm 和 npx  
2.gulp 命令行工具: npm install --global gulp-cli  
3.创建项目目录并进入:   
mkdir gulp-test;   
cd gulp-test;   
4.创建package.json文件: npm init
5.安装gulp并创建依赖：npm install --save-dev gulp
6.项目根目录创建gulpfile.js  
```
function defaultTask(cb) {
 cb();
}
exports.default = defaultTask;
```
7.运行任务: gulp;  


## gulpfile
*Gulp 允许你使用现有 JavaScript 知识来书写 gulpfile 文件，或者利用你所掌握的 gulpfile 经验来书写普通的 JavaScript 代码。虽然gulp 提供了一些实用工具来简化文件系统和命令行的操作，但是你所编写的其他代码都是纯 JavaScript 代码*

### Gulpfile 详解
gulpfile 是项目目录下名为 gulpfile.js （或者首字母大写 Gulpfile.js，就像 Makefile 一样命名）的文件，在运行 gulp 命令时会被自动加载。在这个文件中，你经常会看到类似 src()、dest()、series() 或 parallel() 函数之类的 gulp API，除此之外，纯 JavaScript 代码或 Node 模块也会被使用。任何导出（export）的函数都将注册到 gulp 的任务（task）系统中。

### Gulpfile 转译
你可以使用需要转译的编程语言来书写 gulpfile 文件，例如 TypeScript 或 Babel，通过修改 gulpfile.js 文件的扩展名来表明所用的编程语言并安装对应的转译模块。
对于 TypeScript，重命名为 gulpfile.ts 并安装 ts-node 模块。  
对于 Babel，重命名为 gulpfile.babel.js 并安装 @babel/register 模块。  
针对此功能的高级知识和已支持的扩展名的完整列表，请参考 gulpfile 转译 文档。  

### Gulpfile 分割
大部分用户起初是将所有业务逻辑都写到一个 gulpfile 文件中。随着文件的变大，可以将此文件重构为数个独立的文件。  
每个任务（task）可以被分割为独立的文件，然后导入（import）到 gulpfile 文件中并组合。这不仅使事情变得井然有序，而且可以对每个任务（task）进行单独测试，或者根据条件改变组合。  
Node 的模块解析功能允许你将 gulpfile.js' 文件替换为同样命名为 gulpfile.js 的目录，该目录中包含了一个名为 index.js 的文件，该文件被当作 gulpfile.js 使用。并且，该目录中还可以包含各个独立的任务（task）模块。

### 创建任务（task）
每个 gulp 任务（task）都是一个异步的 JavaScript 函数，此函数是一个可以接收 callback 作为参数的函数，或者是一个返回 stream、promise、event emitter、child process 或 observable (后面会详细讲解) 类型值的函数。由于某些平台的限制而不支持异步任务，因此 gulp 还提供了一个漂亮 替代品。

### 导出任务
任务（tasks）可以是 public（公开） 或 private（私有） 类型的。

公开任务（Public tasks） 从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用。
私有任务（Private tasks） 被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分。
一个私有（private）类型的任务（task）在外观和行为上和其他任务（task）是一样的，但是不能够被用户直接调用。如需将一个任务（task）注册为公开（public）类型的，只需从 gulpfile 中导出（export）即可。
```
const { series } = require('gulp');

// `clean` 函数并未被导出（export），因此被认为是私有任务（private task）。
// 它仍然可以被用在 `series()` 组合中。
function clean(cb) {
  // body omitted
  cb();
}

// `build` 函数被导出（export）了，因此它是一个公开任务（public task），并且可以被 `gulp` 命令直接调用。
// 它也仍然可以被用在 `series()` 组合中。
function build(cb) {
  // body omitted
  cb();
}

exports.build = build;
exports.default = series(clean, build);
ALT TEXT MISSING
```
在以前的 gulp 版本中，task() 方法用来将函数注册为任务（task）。虽然这个 API 依旧是可以使用的，但是 导出（export）将会是主要的注册机制，除非遇到 export 不起作用的情况。

### 组合任务
Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。series() 和 parallel() 可以互相嵌套至任意深度。

如果需要让任务（task）按顺序执行，请使用 series() 方法。  
```
const { series } = require('gulp');

function transpile(cb) {
  // body omitted
  cb();
}

function bundle(cb) {
  // body omitted
  cb();
}

exports.build = series(transpile, bundle);
对于希望以最大并发来运行的任务（tasks），可以使用 parallel() 方法将它们组合起来。

const { parallel } = require('gulp');

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.build = parallel(javascript, css);
```
当 series() 或 parallel() 被调用时，任务（tasks）被立即组合在一起。这就允许在组合中进行改变，而不需要在单个任务（task）中进行条件判断。
```
const { series } = require('gulp');

function minify(cb) {
  // body omitted
  cb();
}


function transpile(cb) {
  // body omitted
  cb();
}

function livereload(cb) {
  // body omitted
  cb();
}

if (process.env.NODE_ENV === 'production') {
  exports.build = series(transpile, minify);
} else {
  exports.build = series(transpile, livereload);
}
```
series() 和 parallel() 可以被嵌套到任意深度。
```
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function cssTranspile(cb) {
  // body omitted
  cb();
}

function cssMinify(cb) {
  // body omitted
  cb();
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(
    cssTranspile,
    series(jsTranspile, jsBundle)
  ),
  parallel(cssMinify, jsMinify),
  publish
);
```
当一个组合操作执行时，这个组合中的每一个任务每次被调用时都会被执行。例如，在两个不同的任务（task）之间调用的 clean 任务（task）将被执行两次，并且将导致不可预期的结果。因此，最好重构组合中的 clean 任务（task）。
如果你有如下代码：  
```
// This is INCORRECT
const { series, parallel } = require('gulp');

const clean = function(cb) {
  // body omitted
  cb();
};

const css = series(clean, function(cb) {
  // body omitted
  cb();
});

const javascript = series(clean, function(cb) {
  // body omitted
  cb();
});

exports.build = parallel(css, javascript);
```
重构为：
```
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```

### 异步执行
Node 库以多种方式处理异步功能。最常见的模式是 error-first callbacks，但是你还可能会遇到 streams、promises、event emitters、child processes, 或 observables。gulp 任务（task）规范化了所有这些类型的异步功能。

任务（task）完成通知
当从任务（task）中返回 stream、promise、event emitter、child process 或 observable 时，成功或错误值将通知 gulp 是否继续执行或结束。如果任务（task）出错，gulp 将立即结束执行并显示该错误。

当使用 series() 组合多个任务（task）时，任何一个任务（task）的错误将导致整个任务组合结束，并且不会进一步执行其他任务。当使用 parallel() 组合多个任务（task）时，一个任务的错误将结束整个任务组合的结束，但是其他并行的任务（task）可能会执行完，也可能没有执行完。

返回 stream
```
const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;
```
返回 promise
```
function promiseTask() {
  return Promise.resolve('the value is ignored');
}

exports.default = promiseTask;
```
返回 event emitter
```
const { EventEmitter } = require('events');

function eventEmitterTask() {
  const emitter = new EventEmitter();
  // Emit has to happen async otherwise gulp isn't listening yet
  setTimeout(() => emitter.emit('finish'), 250);
  return emitter;
}

exports.default = eventEmitterTask;
```
返回 child process
```
const { exec } = require('child_process');

function childProcessTask() {
  return exec('date');
}

exports.default = childProcessTask;
返回 observable
const { Observable } = require('rxjs');

function observableTask() {
  return Observable.of(1, 2, 3);
}

exports.default = observableTask;
```

使用 callback
如果任务（task）不返回任何内容，则必须使用 callback 来指示任务已完成。在如下示例中，callback 将作为唯一一个名为 cb() 的参数传递给你的任务（task）。
```
function callbackTask(cb) {
  // `cb()` should be called by some async work
  cb();
}

exports.default = callbackTask;
```
如需通过 callback 把任务（task）中的错误告知 gulp，请将 Error 作为 callback 的唯一参数。
```
function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error('kaboom'));
}

exports.default = callbackError;
```
然而，你通常会将此 callback 函数传递给另一个 API ，而不是自己调用它。
```
const fs = require('fs');

function passingCallback(cb) {
  fs.access('gulpfile.js', cb);
}

exports.default = passingCallback;
```
gulp 不再支持同步任务（Synchronous tasks）
gulp 不再支持同步任务（Synchronous tasks）了。因为同步任务常常会导致难以调试的细微错误，例如忘记从任务（task）中返回 stream。

当你看到 "Did you forget to signal async completion?" 警告时，说明你并未使用前面提到的返回方式。你需要使用 callback 或返回 stream、promise、event emitter、child process、observable 来解决此问题。

使用 async/await
如果不使用前面提供到几种方式，你还可以将任务（task）定义为一个 async 函数，它将利用 promise 对你的任务（task）进行包装。这将允许你使用 await 处理 promise，并使用其他同步代码。
```
const fs = require('fs');

async function asyncAwaitTask() {
  const { version } = fs.readFileSync('package.json');
  console.log(version);
  await Promise.resolve('some result');
}

exports.default = asyncAwaitTask;
```

### 处理文件
gulp 暴露了 src() 和 dest() 方法用于处理计算机上存放的文件。

src() 接受 glob 参数，并从文件系统中读取文件然后生成一个 Node 流（stream）。它将所有匹配的文件读取到内存中并通过流（stream）进行处理。

由 src() 产生的流（stream）应当从任务（task）中返回并发出异步完成的信号，就如 创建任务（task） 文档中所述。

const { src, dest } = require('gulp');

exports.default = function() {
  return src('src/*.js')
    .pipe(dest('output/'));
}
流（stream）所提供的主要的 API 是 .pipe() 方法，用于连接转换流（Transform streams）或可写流（Writable streams）。

const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}
dest() 接受一个输出目录作为参数，并且它还会产生一个 Node 流（stream），通常作为终止流（terminator stream）。当它接收到通过管道（pipeline）传输的文件时，它会将文件内容及文件属性写入到指定的目录中。gulp 还提供了 symlink() 方法，其操作方式类似 dest()，但是创建的是链接而不是文件（ 详情请参阅 symlink() ）。

大多数情况下，利用 .pipe() 方法将插件放置在 src() 和 dest() 之间，并转换流（stream）中的文件。

向流（stream）中添加文件
src() 也可以放在管道（pipeline）的中间，以根据给定的 glob 向流（stream）中添加文件。新加入的文件只对后续的转换可用。如果 glob 匹配的文件与之前的有重复，仍然会再次添加文件。

这对于在添加普通的 JavaScript 文件之前先转换部分文件的场景很有用，添加新的文件后可以对所有文件统一进行压缩并混淆（uglifying）。

const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}
分阶段输出
dest() 可以用在管道（pipeline）中间用于将文件的中间状态写入文件系统。当接收到一个文件时，当前状态的文件将被写入文件系统，文件路径也将被修改以反映输出文件的新位置，然后该文件继续沿着管道（pipeline）传输。

此功能可用于在同一个管道（pipeline）中创建未压缩（unminified）和已压缩（minified）的文件。

const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(dest('output/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}
模式：流动（streaming）、缓冲（buffered）和空（empty）模式
src() 可以工作在三种模式下：缓冲（buffering）、流动（streaming）和空（empty）模式。这些模式可以通过对 src() 的 buffer 和 read 参数 进行设置。

缓冲（Buffering）模式是默认模式，将文件内容加载内存中。插件通常运行在缓冲（buffering）模式下，并且许多插件不支持流动（streaming）模式。
流动（Streaming）模式的存在主要用于操作无法放入内存中的大文件，例如巨幅图像或电影。文件内容从文件系统中以小块的方式流式传输，而不是一次性全部加载。如果需要流动（streaming）模式，请查找支持此模式的插件或自己编写。
空（Empty）模式不包含任何内容，仅在处理文件元数据时有用

### Glob 详解
globs参数是文件匹配模式(类似正则表达式)，用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。
options为可选参数。通常情况下我们不需要用到。

下面我们重点说说Gulp用到的glob的匹配规则以及一些文件匹配技巧。
Gulp内部使用了node-glob模块来实现其文件匹配功能。我们可以使用下面这些特殊的字符来匹配我们想要的文件：
```
* 匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
** 匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
? 匹配文件路径中的一个字符(不会匹配路径分隔符)
[...] 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法
!(pattern|pattern|pattern) 匹配任何与括号中给定的任一模式都不匹配的
?(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
+(pattern|pattern|pattern) 匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
*(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
@(pattern|pattern|pattern) 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)
下面以一系列例子来加深理解

* 能匹配 a.js,x.y,abc,abc/,但不能匹配a/b.js
*.* 能匹配 a.js,style.css,a.b,x.y
*/*/*.js 能匹配 a/b/c.js,x/y/z.js,不能匹配a/b.js,a/b/c/d.js
** 能匹配 abc,a/b.js,a/b/c.js,x/y/z,x/y/z/a.b,能用来匹配所有的目录和文件
**/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js
a/**/z 能匹配 a/z,a/b/z,a/b/c/z,a/d/g/h/j/k/z
a/**b/z 能匹配 a/b/z,a/sb/z,但不能匹配a/x/sb/z,因为只有单**单独出现才能匹配多级目录
?.js 能匹配 a.js,b.js,c.js
a?? 能匹配 a.b,abc,但不能匹配ab/,因为它不会匹配路径分隔符
[xyz].js 只能匹配 x.js,y.js,z.js,不会匹配xy.js,xyz.js等,整个中括号只代表一个字符
[^xyz].js 能匹配 a.js,b.js,c.js等,不能匹配x.js,y.js,z.js
当有多种匹配模式时可以使用数组

//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
使用数组的方式还有一个好处就是可以很方便的使用排除模式，在数组中的单个匹配模式前加上!即是排除模式，它会在匹配的结果中排除这个匹配，要注意一点的是不能在数组中的第一个元素中使用排除模式

gulp.src([*.js,'!b*.js']) //匹配所有js文件，但排除掉以b开头的js文件
gulp.src(['!b*.js',*.js]) //不会排除任何文件，因为排除模式不能出现在数组的第一个元素中
此外，还可以使用展开模式。展开模式以花括号作为定界符，根据它里面的内容，会展开为多个模式，最后匹配的结果为所有展开的模式相加起来得到的结果。展开的例子如下：

a{b,c}d 会展开为 abd,acd
a{b,}c 会展开为 abc,ac
a{0..3}d 会展开为 a0d,a1d,a2d,a3d
a{b,c{d,e}f}g 会展开为 abg,acdfg,acefg
a{b,c}d{e,f}g 会展开为 abdeg,acdeg,abdeg,abdfg
```

### 使用插件
Gulp 插件实质上是 Node 转换流（Transform Streams），它封装了通过管道（pipeline）转换文件的常见功能，通常是使用 .pipe() 方法并放在 src() 和 dest() 之间。他们可以更改经过流（stream）的每个文件的文件名、元数据或文件内容
常用插件：   
<!-- require-dir  这种文件架构让任务按照类型分成子任务放在单独的文件中，可以自由的添加子任务 -->

#### 自动加载插件 gulp-load-plugins
安装：npm install --save-dev gulp-load-plugins
gulp-load-plugins这个插件能自动帮你加载package.json文件里的gulp插件。例如假设你的package.json文件里的依赖是这样的:
```
{
  "devDependencies": {
    "gulp": "~3.6.0",
    "gulp-rename": "~1.2.0",
    "gulp-ruby-sass": "~0.4.3",
    "gulp-load-plugins": "~0.5.1"
  }
}
```
然后我们可以在gulpfile.js中使用gulp-load-plugins来帮我们加载插件：

var gulp = require('gulp');
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
然后我们要使用gulp-rename和gulp-ruby-sass这两个插件的时候，就可以使用plugins.rename和plugins.rubySass来代替了,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。
实质上gulp-load-plugins是为我们做了如下的转换
plugins.rename = require('gulp-rename');
plugins.rubySass = require('gulp-ruby-sass');
gulp-load-plugins并不会一开始就加载所有package.json里的gulp插件，而是在我们需要用到某个插件的时候，才去加载那个插件。

#### 重命名 gulp-rename
安装：npm install --save-dev gulp-rename
用来重命名文件流中的文件。用gulp.dest()方法写入文件时，文件名使用的是文件流中的文件名，如果要想改变文件名，那可以在之前用gulp-rename插件来改变文件流中的文件名。
```
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require("gulp-uglify");
 
gulp.task('rename', function () {
    gulp.src('js/jquery.js')
    .pipe(uglify())  //压缩
    .pipe(rename('jquery.min.js')) //会将jquery.js重命名为jquery.min.js
    .pipe(gulp.dest('js'));
    //关于gulp-rename的更多强大的用法请参考https://www.npmjs.com/package/gulp-rename
});
```

#### js文件压缩 gulp-uglify
安装：npm install --save-dev gulp-uglify
用来压缩js文件，使用的是uglify引擎
```
var gulp = require('gulp'),
    uglify = require("gulp-uglify");
 
gulp.task('minify-js', function () {
    gulp.src('js/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(gulp.dest('dist/js')); //压缩后的路径
});
```

#### css文件压缩 gulp-minify-css
现在用gulp-cssnano
安装：npm install --save-dev gulp-cssnano
用来压缩css文件
```
var gulp = require('gulp'),
    cssnano = require("gulp-gulp-cssnano");
gulp.task('minify-css', function () {
    gulp.src('css/*.css') // 
    .pipe(cssnano()) //压缩
    .pipe(gulp.dest('dist/css'));
});
```

#### html文件压缩
使用gulp-htmlmin
安装：npm install --save-dev gulp-htmlmin
用来压缩html文件
```
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
 
gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});
```

#### js代码检查
使用gulp-eslint
安装：npm install gulp-eslint
用来检查js代码
```
var gulp = require('gulp'),
    eslint = require('gulp-eslint');
 
gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
    return gulp.src(['**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
});
 
gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful... 
});
```

#### 文件合并
使用gulp-concat
安装：npm install --save-dev gulp-concat
用来把多个文件合并为一个文件,我们可以用它来合并js或css文件等，这样就能减少页面的http请求数了
```
var gulp = require('gulp'),
    concat = require("gulp-concat");
 
gulp.task('concat', function () {
    gulp.src('js/*.js')  //要合并的文件
    .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('dist/js'));
});
```

#### less和sass的编译
less使用gulp-less,安装：npm install --save-dev gulp-less
```
var gulp = require('gulp'),
    less = require("gulp-less");
 
gulp.task('compile-less', function () {
    gulp.src('less/*.less')
    .pipe(less())
    .pipe(gulp.dest('dist/css'));
});
```
sass使用gulp-sass,安装：npm install --save-dev gulp-sass
```
var gulp = require('gulp'),
    sass = require("gulp-sass");
 
gulp.task('compile-sass', function () {
    gulp.src('sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
});
```

#### 图片压缩
可以使用gulp-imagemin插件来压缩jpg、png、gif等图片。
安装：npm install --save-dev gulp-imagemin
```
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); //png图片压缩插件
 
gulp.task('default', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('dist'));
});
gulp-imagemin的使用比较复杂一点，而且它本身也有很多插件，建议去它的项目主页看看文档
```

#### 自动刷新
使用browser-sync插件，安装:npm install browser-sync。
当代码变化时，它可以帮我们自动刷新页面
该插件最好配合谷歌浏览器来使用，且要安装livereload chrome extension扩展插件,不能下载的请自行FQ。
```
import browserSync from 'browser-sync';
const reload = browserSync.reload; 
gulp.watch('test/spec/**/*.js').on('change', reload); return gulp.src(files)
.pipe(reload({stream: true, once: true}))
```



https://www.w3cschool.cn/qtaitm/
https://www.cnblogs.com/2050/p/4198792.html
https://www.gulpjs.com.cn/docs/api/src/