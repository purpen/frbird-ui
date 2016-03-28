;(function(){
	//web 下载二维码
	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		if ( scrollTop < 200 || scrollTop > $('#ft').offset().top-650 ){
			$('.iosewm img').fadeOut(800);
		}
		if( scrollTop > 200 && scrollTop < $('#ft').offset().top-650 ){
			$('.iosewm img').fadeIn(800);
		}
	});


})(jQuery);