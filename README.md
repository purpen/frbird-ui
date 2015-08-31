![Frbird](http://frstatic.qiniudn.com/images/link-logo1.jpg)

# Frbird UI
Site [taihuoniao.com](http://www.taihuoniao.com/)

#### Browser Support

* Last 2 Versions FF, Chrome, IE 10+, Safari Mac
* IE 10+
* Android 4

Browser prefixes are present for Internet Explorer 9, but the browser is not officially supported.

### Install

### Dependencies Support

####第一步：安装Node
首先，最基本也最重要的是，我们需要搭建node环境。访问[http://nodejs.org](http://nodejs.org)，然后点击大大的绿色的install按钮，下载完成后直接运行程序，就一切准备就绪。[npm](https://npmjs.org/)会随着安装包一起安装，稍后会用到它。

####第二步：安装gulp
NPM是基于命令行的node包管理工具，它可以将node的程序模块安装到项目中，在它的官网中可以查看和搜索所有可用的程序模块。

在命令行中输入

```bash
$ npm install --save-dev gulp 
```

####安装这些插件需要运行如下命令
```bash
$ npm install gulp-less gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-copy gulp-livereload gulp-cache del --save-dev
```

备注
* npm是安装node模块的工具，执行install命令
* -g表示在全局环境安装，以便任何项目都能使用它
* gulp是将要安装的node模块的名字

运行时注意查看命令行有没有错误信息，安装完成后，你可以使用下面的命令查看gulp的版本号以确保gulp已经被正确安装。

```bash
$ gulp -v
```

### 压缩命令

```bash
gulp comprass
```











