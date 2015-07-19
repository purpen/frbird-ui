var gulp = require('gulp'),
    
    // gulp dependencies
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    
    rename = require('gulp-rename'),
    del = require('del'),
    path = require('path')
;

// 配置文件路径
var paths = {
    dist: {
        minified: 'dist/minified',
        uncompressed: 'dist/uncompressed',
        packaged: 'dist/packaged',
    },
    
};

// 压缩js
gulp.task('minifyjs', function(){
    return gulp.src(['src/js/*.js', 'src/js/**/*.js'])
            // 语法检查
            //.pipe(jshint())
            //.pipe(jshint.reporter('default'))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(paths.dist.minified + '/js'));
});

// 合并,压缩js
gulp.task('packagejs', function(){
    // jquery plugins
    gulp.src(paths.dist.minified + '/js/jquery/*.js')
        .pipe(concat('jquery.plugins.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/js'));
    
    // frbird
    gulp.src(paths.dist.minified + '/js/phenix.min.js')
        .pipe(concat('frbird.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/js'));
    
    // froala editor
    gulp.src([
        paths.dist.minified + '/js/froala_editor.v1.2.7.min.js', 
        paths.dist.minified + '/js/plugins/*.js', 
        paths.dist.minified + '/js/langs/*.js'])
        .pipe(concat('froala_editor.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/js'));
        
    // calendar    
    gulp.src(paths.dist.minified + '/js/calendar/*.js')
        .pipe(concat('calendar.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/js'));
        
    // gsap    
    gulp.src(paths.dist.minified + '/js/gsap/*.js')
        .pipe(concat('jquery.gsap.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/js'));
});

// 预编译less,压缩css
gulp.task('minifycss', function(){
    // 通过pipe() 把要处理的文件导向插件,通过查找对应插件的api执行对应的命令
    gulp.src(['src/site/*.less', 'src/site/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest(paths.dist.uncompressed + '/css'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.minified + '/css'));
});

// 合并,压缩css
gulp.task('packagecss', function(){
    // 合并css
    gulp.src(paths.dist.minified + '/css/calendar/*.css')
        .pipe(concat('calendar.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
        
    gulp.src(paths.dist.minified + '/css/froala_editor/*.css')
        .pipe(concat('froala_editor.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
        
    gulp.src(paths.dist.minified + '/css/ie/ie9.min.css')
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
    
    gulp.src(paths.dist.minified + '/css/mobile/mobile.min.css')
        .pipe(concat('mobile.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
        
    gulp.src(paths.dist.minified + '/css/*.css')
        .pipe(concat('frbird.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
});

// 批量命令
gulp.task('comprass', ['minifycss', 'minifyjs'], function(){
    gulp.start('packagecss', 'packagejs');
});

// 清理旧文件
gulp.task('clean', function(cb){
    del(['dist/minified', 'dist/uncompressed', 'dist/packaged'], cb); 
});

// 设置默认任务
gulp.task('default', ['clean'], function(){
    gulp.start('minifycss', 'minifyjs');
});

// 监听事件
gulp.task('watch', function(){
    // 监听文件是否修改，以便执行相应的任务
    gulp.watch('src/site/*.less', ['minifycss']);
    gulp.watch('src/js/*/*.js', ['minifyjs']);
});
