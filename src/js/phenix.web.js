;(function(){
	//web 下载二维码
	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		if ( scrollTop < 200 || scrollTop > $('#ft').offset().top-650 ){
			$('.iosewm img').fadeOut(0);
		}
		if( scrollTop > 200 && scrollTop < $('#ft').offset().top-650 ){
			$('.iosewm img').fadeIn(0);
		}
	});
	var flright = Number($('body').width() - $('.ui.responsive.grid').width())/2 - 34 +'px';
	$('.mb-wap').css('right', flright );
	$('.ui.topup.icon.scrollright').livequery(function(){
		$(this).css('right', flright );
	})

})(jQuery);