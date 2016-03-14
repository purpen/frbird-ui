var gulp = require('gulp'),
    
    // gulp dependencies
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    
    rename = require('gulp-rename'),
    del = require('del'),
    copy = require('gulp-copy'),
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
            .pipe(gulp.dest(paths.dist.minified + '/javascript'));
});

// 合并,压缩js
gulp.task('packagejs', function(){
    // semantic-2.1.5
    gulp.src(paths.dist.minified + '/javascript/semantic-2.1.5.min.js')
        .pipe(concat('semantic-2.1.5.min.js'))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
        
    // jquery
    gulp.src(paths.dist.minified + '/javascript/jquery-2.1.0.min.js')
        .pipe(concat('jquery-2.min.js'))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
    
    // jquery plugins
    gulp.src([
		paths.dist.minified + '/javascript/jquery/jquery.taconite.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.livequery.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.form.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.imgareaselect.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.fineuploader-3.5.0.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.countdown.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.address.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.easing.1.3.min.js',
        paths.dist.minified + '/javascript/jquery/mustache.min.js',
		paths.dist.minified + '/javascript/jquery/sly.min.js',
        paths.dist.minified + '/javascript/jquery/jquery.flexslider.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.slides.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.scrollUp.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.smint.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.scrollify.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.qrcode.min.js',
		paths.dist.minified + '/javascript/jquery/lightbox.min.js',
		paths.dist.minified + '/javascript/jquery/skrollr.min.js',
		paths.dist.minified + '/javascript/jquery/picker.min.js',
		paths.dist.minified + '/javascript/jquery/picker.date.min.js',
		paths.dist.minified + '/javascript/jquery/maxlength.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.arbitrary-anchor.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.gritter.min.js',
        paths.dist.minified + '/javascript/jquery/jquery.caret.min.js',
		paths.dist.minified + '/javascript/jquery/jquery.atwho.min.js',
        ])
        .pipe(concat('jquery.plugins.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
    
    // frbird
    gulp.src(paths.dist.minified + '/javascript/phenix.min.js')
        .pipe(concat('frbird.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
    
    // froala editor
    gulp.src([
        paths.dist.minified + '/javascript/froala_editor.v1.2.7.min.js', 
        paths.dist.minified + '/javascript/plugins/*.js', 
        paths.dist.minified + '/javascript/langs/*.js'])
        .pipe(concat('froala_editor.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
        
    // calendar    
    gulp.src([
            paths.dist.minified + '/javascript/calendar/calendar.min.js',
            paths.dist.minified + '/javascript/calendar/calendar-en.min.js'
        ])
        .pipe(concat('calendar.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
        
    // gsap    
    gulp.src(paths.dist.minified + '/javascript/gsap/*.js')
        .pipe(concat('jquery.gsap.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
		
    // gridste  拖拽插件  
    gulp.src(paths.dist.minified + '/javascript/gridste/*.js')
        .pipe(concat('gridste.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
		
	// H5 wechat
    gulp.src([
		paths.dist.minified + '/javascript/wechat/zepto/zepto.min.min.js', //   合并 dist/js/ 里 文件
		paths.dist.minified + '/javascript/wechat/touch.min.js',
		paths.dist.minified + '/javascript/wechat/PageSlider.min.js',
		paths.dist.minified + '/javascript/wechat/PxLoader.min.js',
		paths.dist.minified + '/javascript/wechat/PxLoaderImage.min.js',
		//paths.dist.minified + '/js/index.min.js'
        ])
        .pipe(concat('wechat.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));
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
    
    gulp.src(paths.dist.minified + '/css/semantic-2.1.5.min.css')
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
        
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
		
    gulp.src(paths.dist.minified + '/css/gridste/*.css')
        .pipe(concat('gridste.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(['src/images/*.*', 'src/images/**/*.*'])
    // Pass in options to the task
    .pipe(gulp.dest(paths.dist.packaged + '/images'));
});

// 批量命令
gulp.task('comprass', ['minifycss', 'minifyjs'], function(){
    gulp.start('packagecss', 'packagejs', 'images');
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
    gulp.watch('src/js/*.js', ['minifyjs']);
    gulp.watch('src/js/*/*.js', ['minifyjs']);
});
