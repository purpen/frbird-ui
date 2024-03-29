/*
 * phenix base js 
 */

var phenix = {
	    // 当前访问者用户信息
	    visitor: {},
		url : {},
		redirect: function(url,delay) {
	        setTimeout(function(){
				window.location = url;
			},delay);
	    },
	    show_error_note: function(msg,delay) {
			msg = '<div class="content">'+ msg +'</div>';
	    	phenix.show_notify_bar(msg,'error',delay);
	    },
	    show_ok_note:function(msg,delay) {
			msg = '<div class="content">'+ msg +'</div>';
	    	phenix.show_notify_bar(msg,'ok', delay);
	    },
	    show_notify_bar: function(msg,type,delay) {
            var class_name;
	        if(!type || type == 'ok'){
	        	type = 'ok';
				class_name = 'success';
	        }else{
				type = 'error';
				class_name = 'error';
	        }
			
			$.gritter.add({
				title: '',
				text: msg,
				time: delay,
				class_name: class_name,
			});
            // 让显示框可以显示在弹出层之上
            $('#gritter-notice-wrapper').css({'z-index':1000});
	    }
};

phenix.show_error_message = function(errors, ele) {
	var html = '<ul class="list">';
  	if ($.isArray(errors)) {
	  	$.each(errors, function(index, value) {
	    	html += '<li>' + value + '</li>';
	  	});
  	} else {
  		html += '<li>' + errors + '</li>';
  	}
  	html += '</ul>';
  	
	$('<div/>')
		.addClass('ui danger message')
		.html(html)
		.prependTo(ele);
};

phenix.show_ok_message = function(msg, ele) {  	
	alert(msg);
};

phenix.before_submit = function() {
	$('.ui.submit.button').addClass('loading').addClass('submit_back').removeClass('submit');
	$('.ui.error.message').remove();
	return true;
};

phenix.after_submit = function() {
	$('.ui.submit_back.button').removeClass('loading').removeClass('submit_back').addClass('submit');
	return true;
};

/*
 * 初始化,设置常用的ajax hook
 */
phenix.initial = function(){

  // 全局去掉ajax cache
  $.ajaxSetup({cache:false});
	
	/* 此类为确认后执行的ajax操作 */
	$('a.confirm-request').livequery(function(){
		$(this).click(function(){
			if(confirm('确认执行这个操作吗?')){
	        	$.get($(this).attr('href'));
	        }
	        return false;
		});
	});	
    
    /* 此类为ajax链接 */
	$('a.ajax').livequery(function(){
		$(this).click(function(){
			var res_url = $(this).attr('href');
			// 所有ajax请求，验证是否登录
			if (!phenix.visitor.is_login){
				phenix.show_login_box(res_url);
				return false;
			}
			// 发送ajax请求
			$.get(res_url);
			
	        return false;
		});
	});
	
	// 消息框
	$('.ui.message .close').livequery(function(){
		$(this).on('click', function() {
			$(this).closest('.ui.message').fadeOut('slow').css('z-index','-1');
		});
	});
	
	// 购物车
	$('.ui.basket.button').livequery(function(){
		$(this).on('click', function() {
			var url = $(this).data('url');
			phenix.redirect(url);
		});
	});
	
	// 从购物车删除
	$('#shopping-basket .ui.close.button').livequery(function(){
		$(this).bind('click', function(){
			var sku = $(this).data('sku');
			$.get(phenix.url.domain+'/shopping/remove', {sku: sku});
			return false;
		});
	});
	
	$('#searchbar i.search.icon').click(function(){
		$('#searchbar').submit();
	});
	
	// 取消并返回上一步
	$('.ui.cancel.button').bind('click', function(){
		window.location.href = document.referrer;
	});
	
	$('.ui.pop').popup();
	
	$('.ui.checkbox').checkbox();
	
	$('.ui.selection.dropdown').dropdown();
	
	$('.ui.dropdown').dropdown({
		on  : 'hover'
	});
	
	// 显示微信二维码
	$('.ui.wechat.button').click(function(){
		$('.ui.wechat.modal').modal('show');
		return false;
	});
	
	$('.ui.accordion').accordion();
	
	$.scrollUp({
        scrollText: '<i class="angle up icon"></i>',
		className: 'ui topup icon scrollright',
        scrollTitle: false
    });
	
	phenix.showbox();

	$('.promo .close-promo').click(function(){
		$('.promo').slideUp('slow');
		return false;
	});
    
	$('textarea.comment-textarea').maxlength({
      'feedback' : '.wordscount'
    });
    
    // 显示用户信息
    phenix.show_user_idcard();
};

// 显示登录弹出框
phenix.show_login_box = function(next_res_url) {
    /* 登录表单验证 */
	$('#loginbox-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '输入你注册时填写的邮件或手机号码'
				}
			]
		},
		password: {
			identifier  : 'password',
			rules: [
				{
					type   : 'empty',
					prompt : '输入正确的登录密码'
				},
				{
					type   : 'length[6]',
					prompt : '登录密码为必须6位以上字符'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(this).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					phenix.before_submit();
				},
				success: function(result){
					phenix.after_submit();
					
					if(result.is_error){
						$(event.target).addClass('error');
						phenix.show_error_note(result.message);
					}else{
						$('.ui.loginbox.modal').modal('hide');
						phenix.visitor = result.data;
						// 登录成功后，自动发送ajax请求
						if (next_res_url) {
							$.get(next_res_url);
						}
					}
				}
			});
		}
	});
	
	// 显示登录框
	$('.ui.loginbox.modal').modal('show');
}

// wap显示登录弹出框
phenix.wap_show_sign_box = function(next_res_url, type) {

  $('.two.fields .field').tab();
  $('.two.fields .field .fluid').tab();
    /* 登录表单验证 */
	$('#login-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '输入你注册时填写的手机号码'
				}
			]
		},
		password: {
			identifier  : 'password',
			rules: [
				{
					type   : 'empty',
					prompt : '输入正确的登录密码'
				},
				{
					type   : 'length[6]',
					prompt : '登录密码为必须6位以上字符'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(this).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					phenix.before_submit();
				},
				success: function(result){
					phenix.after_submit();
					
					if(result.is_error){
						$(event.target).addClass('error');
						phenix.show_error_note(result.message);
					}else{
						$('.ui.sign-box.modal').modal('hide');
						phenix.visitor = result.data;
						// 登录成功后，自动发送ajax请求
						if (next_res_url) {
              if(type==1){
                phenix.redirect(next_res_url);
              }else if(type==2){
 							  $.get(next_res_url);             
              }
						}
					}
				}
			});
		}
	});

  /*注册表单验证*/
	$('#register-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '手机号不能为空'
				}
			]
		},
		verify_code: {
			identifier  : 'verify_code',
			rules: [
				{
					type   : 'empty',
					prompt : '验证码不能为空'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(event.target).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					phenix.before_submit();
				},
				success: function(result){
					phenix.after_submit();
					if(result.is_error){
						$(event.target).addClass('error');
						phenix.show_error_note(result.message);
					}else{
						$('.ui.sign-box.modal').modal('hide');
						phenix.visitor = result.data;
            alert('您的默认密码为当前手机号后6位,为了您的账户安全,请尽快去个人中心修改密码!');
						// 注册成功后，自动发送ajax请求
						if (next_res_url) {
              if(type==1){
                phenix.redirect(next_res_url);
              }else if(type==2){
 							  $.get(next_res_url);             
              }
						}
					}
					
				}
			});
		}
	});

  //注册时获取验证码
	var wait = 60,can_send=true;
	var limitime = function(){
		if(wait == 0){
			can_send = true;
			wait = 60;
			$('#fetch-verify-code').removeClass('active').text('获取验证码');
		}else{
			can_send = false;
			
			wait--;
			$('#fetch-verify-code').addClass('active').text('重新发送('+wait+')');
			setTimeout(function(){
				limitime();
			}, 1000);
		}
	}
		
	$('#fetch-verify-code').click(function(){
		var phone = $('#account').val();
		if(!can_send){
		    return false;
		}
		if(phone){
      //验证手机是否注册过
      var check_phone_url = '/app/site/auth/check_account';
      $.get(check_phone_url, {phone: phone}, function(r){
        if(r == 1){
          phenix.show_error_note('手机号已存在！');
          return false;     
        }else{
          // 添加发送频率
          limitime();
      
          $this = $('#fetch-verify-code');
          $.getJSON('/app/site/auth/verify_code', {'phone': phone}, function(result){
            if(result.errorCode == 200){
              $this.removeClass('disabled').text('获取验证码');
            }
          });            
        }
      });
		}else{
			phenix.show_error_note('请正确填写手机号码！');
		}
	});
}

/*
 * 显示/隐藏区块
 */
phenix.showbox = function() {
    $('.showbox').livequery(function(){
		$(this).click(function(){
	        var el =  this.hash && this.hash.substr(1);
			$('#'+el).toggle();
	        return false;
		});
    });
};

/*
 * 计数
 */
phenix.doit = function(eid, n, step){
	var el = $('#'+eid),i;
	var now = el.html();
	if (typeof(step) === "undefined"){
		step = 1;
	}
	if (parseInt(now) == n){
		now = 0;
	}
	i = parseInt(now) + step;
	if (isNaN(i)) {
		i = 0;
	}
	if (i < n) {
		el.html(i.toString());
		setTimeout('phenix.doit(\''+eid+'\','+n+','+step+')', 1);
	} else {
		el.html(n.toString());
	}
};

/*
 * 登录,注册页 
 */
phenix.build_auth_page = function() {
    /* 登录表单验证 */
	$('#login-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入您注册时填写的邮件或手机号码'
				}
			]
		},
		password: {
			identifier  : 'password',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入正确的登录密码'
				},
				{
					type   : 'length[6]',
					prompt : '登录密码为必须6位以上字符'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(this).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					phenix.before_submit();
				},
				success: function(data){
					phenix.after_submit();
					
					if(data.is_error){
						phenix.show_error_note(data.message, 5000);
					}else{
						phenix.redirect(data.redirect_url);
					}
					
				}
			});
		}
	});
    
    /*注册表单验证*/
	$('#register-form').form({
		account: {
			identifier  : 'account',
			rules: [
				{
					type   : 'empty',
					prompt : '账户名称不能为空'
				}
			]
		},
		verify_code: {
			identifier  : 'verify_code',
			rules: [
				{
					type   : 'empty',
					prompt : '验证码不能为空'
				}
			]
		},
		password: {
			identifier  : 'password',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入正确的登录密码'
				},
				{
					type   : 'length[6]',
					prompt : '登录密码必须6位以上字符'
				}
			]
		},
		password_confirm: {
			identifier  : 'password_confirm',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入正确的确认密码'
				},
				{
					type   : 'match[password]',
					prompt : '两次输入密码不一致'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(event.target).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					phenix.before_submit();
				},
				success: function(data){
					phenix.after_submit();
					
					if(data.is_error){
						phenix.show_error_note(data.message, 5000);
					}else{
						phenix.redirect(data.redirect_url);
					}
					
				}
			});
		}
	});
};

// 产品话题
phenix.hook_product_topic = function(){
	$('#topic-form').form({
		title: {
			identifier  : 'title',
			rules: [
				{
					type   : 'empty',
					prompt : '标题不能为空'
				},
				{
					type   : 'maxLength[40]',
					prompt : '内容不超过40字符'
				}
			]
		},
		description: {
			identifier  : 'description',
			rules: [
				{
					type   : 'empty',
					prompt : '评论内容不能为空'
				},
				{
					type   : 'maxLength[140]',
					prompt : '评论内容不超过140字符'
				}
			]
		}
	}, {
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(event.target).ajaxSubmit();
		}
	});
};

// hook 评论行为
phenix.hook_comment_page = function(){
  var from_to = arguments[0] ? arguments[0] : 'site'; 
	$('#comment-form').form({
    fields:{
      content: {
        identifier  : 'content',
        rules: [
          {
            type   : 'empty',
            prompt : '评论内容不能为空'
          },
          {
            type   : 'length[5]',
            prompt : '评论内容不能少于5个字符'
          },
          {
            type   : 'maxLength[1000]',
            prompt : '评论内容不超过1000个字符'
          }
        ]
      }
    },
		inline : true,
		onSuccess: function(event){
			event.preventDefault();
			$(this).ajaxSubmit({
				dataType: 'json',
				beforeSubmit: function(){
					phenix.before_submit();
				},
				success: function(result){
					if(result.is_error){
						$(event.target).addClass('error');
						phenix.show_error_note(result.message, event.target);
					}else{
            var rendered = phenix.ajax_render_result('#get_single_comment_tpl', result.data);
            $('.ui.threaded.comments.is-comment').append(rendered);

            $('.comment-textarea').val('');

            if(result.data.from_site=='site'){
              $('.ui.sticky')
                .sticky('refresh')
              ;
            }else{
              if(result.data.rank_has_first_comment){
                //神嘴争霸赛弹出分享事件
                $('#mask').css('display','');
              }
            }

            var is_reply = $(':input[name=is_reply]').val();
            if(is_reply==1){
              // 清空回复ID
              $(':input[name=reply_id]').val('');
              $(':input[name=is_reply]').val(0);
              $(':input[name=reply_user_id]').val('');
              var recover_comment_user_href = $('.cancel-reply-btn').attr('recover_comment_user_href');
              var recover_comment_user_name = $('.cancel-reply-btn').attr('recover_comment_user_name');
              var html = '<a href="'+ recover_comment_user_href +'" class="ui magenta link">'+ recover_comment_user_name +'</a> 发表评论';
              $('#comment-box').find('.comment-title').html(html);            
            }

					}
					phenix.after_submit();
				}
			});
		}
	})

    
    // 绑定跳楼
    $('.gotofloor').bind('keydown', function(e){
        var floor = $(this).val(), max = parseInt($(this).data('max')), url = $(this).data('url');
        if(e.keyCode == 13){
            if (isNaN(floor)){
                alert('必须输入一个数字！');
                return false;
            }
            if (floor > max){
                floor = max;
            }
            window.location.href = url + '/' + floor + '#f' + floor;
        }
    });

    if(from_to=='site'){
        // @功能
        $('#comment-area').atwho({
        at: "@",
        data: '/app/site/user/ajax_follow_list',
        limit: 50,
        //insertTpl: '[l:${url}::@${name}:]',
        insertTpl: '@${name}',
        callbacks: {
          afterMatchFailed: function(at, el) {
          if (at == '@') {
            tags.push(el.text().trim().slice(1));
            this.model.save(tags);
            this.insert(el.text().trim());
            return false;
          }
          }
        }
        });  
    }


};


// 处理批量附件
phenix.rebuild_batch_assets = function(id){
	var batch_assets = $('#batch_assets').val();
	if (batch_assets){
		var asset_ids = batch_assets.split(',');
		if ($.inArray(id, asset_ids) == -1){
			asset_ids.push(id);
			
			$('#batch_assets').val(asset_ids.join(','));
		}
	}else{
		$('#batch_assets').val(id);
	}
};

// Mustache render result
phenix.ajax_render_result = function(eid, data){
    var template = $(eid).html(), rendered = Mustache.render(template, data);
    //console.log(template);
    return rendered;
};

// 显示用户信息
phenix.show_user_idcard = function(){
    var is_ajax = false, hoverTimer, outTimer;
    
    $('.ui.idcard').each(function(e){
        $(this).hover(function(e){
            var uid = $(this).data('uid'),pos = $(this).position(),h = $(this).height(),target = $(this);
            clearTimeout(outTimer);
        
            hoverTimer = setTimeout(function(e){
                if(!is_ajax){
                    if(target.children('.user_card_box').length == 0){
                        $.post(phenix.url.domain+'/user/ajax_fetch_profile', {id: uid}, function(rs){
                            is_ajax = true;
                            rs.data['phenix'] = phenix.url;
                            var rendered = phenix.ajax_render_result('#user_card_tpl', rs.data);
                            $('<div class="user_card_box"></div>')
                                .html(rendered)
                                .appendTo(target)
                                .show(function(){
                                    is_ajax = false;
                                });
                        }, 'json');
                    }else{
                        target.children('.user_card_box')
                            .show();
                    }
                }
            }, 200);
        
        },function(e){
            var target = $(this);
            clearTimeout(hoverTimer);
    
            outTimer = setTimeout(function(){
                target.children('.user_card_box').hide();
            }, 100);
    
            $('.user_card_box').hover(function(e){
                clearTimeout(outTimer);
            },function(e){
                target.children('.user_card_box').hide();
            });
        });
    });
};

// 每日签到点击
phenix.signin = function(){
    $.ajax({
      type: "POST",
      url: "/user/ajax_fetch_user_sign",
      data: {type: 1},
      dataType: 'json',
      cache: false,
      success: function(result){
        var html = phenix.ajax_render_result('#user_sign_box_tpl', result.data);
        $('#user-sign-box').html(html);     
      }
    });
    
    $('#sign-in-btn').livequery(function(){

        $(this).click(function(){
            // 所有ajax请求，验证是否登录
            if (!phenix.visitor.is_login){
                phenix.show_login_box();
                return false;
            }
            // ajax加载签到事件
            $.ajax({
              type: 'POST',
              url: '/user/ajax_sign_in',
              data: {type: 1},
              dataType: 'json',
              cache: false,
              async: false,
              success: function(result){
                if(result.data.give_money==1){
                  result.data.give_money = true;
                }else{
                  result.data.give_money = false;
                }
                if(result.data.is_true==1){
                  result.data.is_true = true;
                }else{
                  result.data.is_true = false;
                }
                var html = phenix.ajax_render_result('#user_sign_box_tpl', result.data);
                $('#user-sign-box').html(html);
                if(result.data.is_doing){
                  window.setTimeout(function(){ $('.add').addClass('add-active'); },500);
                }
              }
            });

        });
    });
};

// 社会化分享
phenix.bind_share_list = function(pic_url) {
	// 链接，标题，网站名称，子窗口别称，网站链接
	var link = encodeURIComponent(document.location),title = encodeURIComponent(document.title.substring(0,100));
	var source = encodeURIComponent('太火鸟'), windowName = 'tShare', site = 'http://www.taihuoniao.com/';
	
	var getParamsOfShareWindow = function(width, height) {
		return ['toolbar=0,status=0,resizable=1,width=' + width + ',height=' + height + ',left=',(screen.width-width)/2,',top=',(screen.height-height)/2].join('');
	}
	
	$('#wechat-share,#wechat-share-1').click(function() {
		$('.ui.qrcode.modal').modal('show');
		return false;
	});
	
	$('#sina-share,#sina-share-1').click(function() {
		var url = 'http://v.t.sina.com.cn/share/share.php?url=' + link + '&title=' + title + '&pic=' + pic_url;
		var params = getParamsOfShareWindow(607, 523);
		window.open(url, windowName, params);
		return false;
	});
	// 同一个页面出现2个
	$('#o-share-weibo').click(function() {
		var url = 'http://v.t.sina.com.cn/share/share.php?url=' + link + '&title=' + title + '&pic=' + pic_url;
		var params = getParamsOfShareWindow(607, 523);
		window.open(url, windowName, params);
		return false;
	});
	$('#tencent-share,#tencent-share-1').click(function() {
		var url = 'http://v.t.qq.com/share/share.php?title=' + title + '&url=' + link + '&site=' + site + '&pic=' + pic_url;
		var params = getParamsOfShareWindow(634, 668);
		window.open(url, windowName, params);
		return false;
	});
	$('#douban-share').click(function() {
		var url = 'http://www.douban.com/recommend/?url=' + link + '&title=' + title + '&pic=' + pic_url;
		var params = getParamsOfShareWindow(450, 350);
		window.open(url, windowName, params);
		return false;
	});
	$('#renren-share,#renren-share-1').click(function() {
		var url = 'http://share.renren.com/share/buttonshare?link=' + link + '&title=' + title + '&pic=' + pic_url;
		var params = getParamsOfShareWindow(626, 436);
		window.open(url, windowName, params);
		return false;
	});
	$('#kaixin001-share').click(function() {
		var url = 'http://www.kaixin001.com/repaste/share.php?rurl=' + link + '&rcontent=' + link + '&rtitle=' + title + '&pic=' + pic_url;
		var params = getParamsOfShareWindow(540, 342);
		window.open(url, windowName, params);
		return false;
	});
	
	$('#netease-share').click(function() {
		var url = 'http://t.163.com/article/user/checkLogin.do?link=' + link + 'source=' + source + '&info='+ title + ' ' + link;
		var params = getParamsOfShareWindow(642, 468);
		window.open(url, windowName, params);
		return false;
	});
	
	$('#facebook-share').click(function() {
		var url = 'http://facebook.com/share.php?u=' + link + '&t=' + title;
		var params = getParamsOfShareWindow(626, 436);
		window.open(url, windowName, params);
		return false;
	});
 
	$('#twitter-share').click(function() {
		var url = 'http://twitter.com/share?url=' + link + '&text=' + title;
		var params = getParamsOfShareWindow(500, 375);
		window.open(url, windowName, params);
		return false;
	});
 
	$('#delicious-share').click(function() {
		var url = 'http://delicious.com/post?url=' + link + '&title=' + title;
		var params = getParamsOfShareWindow(550, 550);
		window.open(url, windowName, params);
		return false;
	});
	
	$('#qzone-share').click(function() {
		var url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + link + '&title=' + title + '&pic=' + pic_url;
		var params = getParamsOfShareWindow(600, 560);
		window.open(url, windowName, params);
		return false;
	});
	
	
 
};

/**
 * 设置cookie，用于区别PC与Mobile。
 */
phenix.create_cookie = function(name, value, days, domain, path){
	var appload = '';
	var expires = '';
	if (days) {
		var d = new Date();
		d.setTime(d.getTime() + (days*24*60*60*1000));
		expires = '; expires=' + d.toGMTString();
	}
	domain = domain ? '; domain=' + domain : '';
	path = '; path=' + (path ? path : '/');
	document.cookie = name + '=' + value + expires + path + domain + appload;
}

/**
 * 读取cookie
 */
phenix.read_cookie = function(name){
	var n = name + '=';
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		var c = cookies[i].replace(/^\s+/, '');
		if (c.indexOf(n) == 0) {
			return c.substring(n.length);
		}
	}
	return null;
}

/**
 * 清除cookie
 */
phenix.erase_cookie = function(name, domain, path){
	create_cookie(name, '', -1, domain, path);
}

/**
 * 全局变量声明
 */
var wps_width=0, wps_height=0, wps_ratio=1;
var scale_width=480, scale_height=0;
var crop_width=0, crop_height=0;



phenix.preview = function(img, selection) {
	if (!selection.width || !selection.height){
		return;
	}
	$('#x1').val(selection.x1);
	$('#y1').val(selection.y1);
	$('#x2').val(selection.x2);
	$('#y2').val(selection.y2);
	$('#w').val(selection.width);
	$('#h').val(selection.height);
};

/**
 * 允许多附件上传
 */
phenix.record_asset_id = function(class_id, id){
    var ids = $('#'+class_id).val();
    if (ids.length == 0){
        ids = id;
    }else{
        if (ids.indexOf(id) == -1){
            ids += ','+id;
        }
    }
    $('#'+class_id).val(ids);
};

//移除附件id
phenix.remove_asset_id = function(class_id, id){
    var ids = $('#'+class_id).val();
    var ids_arr = ids.split(',');
    var is_index_key = phenix.in_array(ids_arr,id);
    ids_arr.splice(is_index_key,1);
    ids = ids_arr.join(',');
    $('#'+class_id).val(ids);
};

//查看字符串是否在数组中存在
phenix.in_array = function(arr, val) {
    var i;
    for (i = 0; i < arr.length; i++) {
        if (val === arr[i]) {
            return i;
        }
    }
    return -1;
}; // 返回-1表示没找到，返回其他值表示找到的索引

// 加载评论方法
phenix.fetch_comment = function(param) {

    // 初始化参数
    var is_star = param.is_star != undefined ? param.is_star : 0;
    
    $.ajax({
      type: "GET",
      url: url,
      data: {target_id: param.target_id, type: param.type, page: param.page, per_page: param.per_page, sort: param.sort, is_star: is_star},
      dataType: 'json',
      cache: false,
      async: false,
      success: function(rs){
        rs.data['phenix'] = phenix.url;
        
        var total_page = parseInt(rs.data.result.total_page);
        var page = parseInt(rs.data.page);
        var per_page = parseInt(rs.data.per_page);

        if(page == 1){
            rs.data.page_first = true;
        }else{
            rs.data.page_first = false;
        }
        
        var rendered = phenix.ajax_render_result('#get_comments_tpl', rs.data);
        $('.is-comment.comments').html(rendered);
        
        // 大于1页
        if( total_page > 1){
            var pager = phenix.ajax_render_result('#pager_tpl', rs.data);
            $('.ui.pagerbox').html(pager);
        }

        // 如果是最新,移除热门评论
        if(rs.data.sort == 1){
            $('.ui.hotset.comments').remove();
        }
        
        // 查看大图
        phenix.comment_blow_up_img();
        
        $('.ui.sticky')
          .sticky('refresh')
        ;
        
        phenix.scrollToHash();
      }
    });

}

phenix.scrollToHash = function(){
    var hash = location.hash.substring(1);
    
    var $el = $('#'+hash).first();
    // Scroll to $el.
    if ( $el && $el.length ) {
      var top = $el.offset().top - 20;
      var $body = $(document.body);
      $body.stop(true, false)
              .animate({ scrollTop: top },  parseInt(750), jQuery.easing.linear);

    }
};

// 查看大图
phenix.comment_blow_up_img = function() {
    $('.comment-img-box').find('img').on('click', function(){
        var evt = $(this).parent('.comment-img-box').attr('show-type');
        if(evt == 1){
            $(this).css({'max-width':'100%', 'cursor':'-moz-zoom-out', 'cursor':'-ms-zoom-out', 'cursor':'-o-zoom-out', 'cursor':'-webkit-zoom-out'});
            $(this).parent('.comment-img-box').attr('show-type', 2);
        }else{
            $(this).css({'max-width':'150px', 'cursor':'-moz-zoom-in', 'cursor':'-ms-zoom-in', 'cursor':'-o-zoom-in', 'cursor':'-webkit-zoom-in'});
            $(this).parent('.comment-img-box').attr('show-type', 1);
        }
    });

};

phenix.updateAreaSelect = function() {
	// todo
};

// Simplified Chinese
jQuery.extend( jQuery.fn.pickadate.defaults, {
    monthsFull: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
    monthsShort: [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二' ],
    weekdaysFull: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
    weekdaysShort: [ '日', '一', '二', '三', '四', '五', '六' ],
    today: '今天',
    clear: '清除',
    firstDay: 1,
    format: 'yyyy-mm-dd',
    formatSubmit: 'yyyy-mm-dd'
});

//懒加载
$("img.lazy").lazyload({
    effect : "fadeIn",
  	threshold : -20
});
$("a.bglazy").lazyload({
   effect : "fadeIn",
   threshold : -20
});
$("div.bglazy").lazyload({
   effect : "fadeIn",
   threshold : -20
});

//手机端导航
//sidebar menu
$('.ui.wap a.launch').on('click',function(){
	$('#cover').css('display','block');
	$('body').addClass('menu-open');
	$('html').css('overflow','hidden');
});
$('.ui.wap #cover').click(function(){
	$('#cover').css('display','none');
	$('body').removeClass('menu-open');
	$('html').removeAttr('style');
});
//底部微信二维码 是否是微信打开
var ua = navigator.userAgent.toLowerCase();  
if(ua.match(/MicroMessenger/i)=="micromessenger"){
	$('.ui.small.wechat.mmfootewm.modal p').html('长按图片，点击识别图片中二维码，关注太火鸟公众号');
}else{
	$('.ui.small.wechat.mmfootewm.modal p').html('保存图片，打开微信扫描二维码，关注太火鸟公众号');
};

//appstore 下载
$('.apploadclose').on('click',function(){
	$('.appiosload').remove();
});
$('#appload,#apploadand').click(function(){
    $('#appload,#apploadand').removeAttr('style');
});
if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)){
	 window.setTimeout(function() { $('.appiosload').fadeIn(1000);},2000);
	$('.appiosload .magenta.inverted.button').click(function(){
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger"){
		//$('#appload').css('display','block');
		window.location='http://a.app.qq.com/o/simple.jsp?pkgname=com.taihuoniao.fineix';
	}else{
		window.location='https://itunes.apple.com/us/app/fiu-fu-you-ke-ji-mei-xue-qing/id1089442815?mt=8';
	}
	});
}else if (navigator.userAgent.match(/android/i)){
 	window.setTimeout(function() { $('.appiosload').fadeIn(1000);},2000);
	$('.appiosload .magenta.inverted.button').click(function(){
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger"){
		//$('#apploadand').css('display','block');
		window.location='http://a.app.qq.com/o/simple.jsp?pkgname=com.taihuoniao.fineix';
	}else{
		//window.location='http://m.taihuoniao.com/promo/android_download';
		window.location='http://a.app.qq.com/o/simple.jsp?pkgname=com.taihuoniao.fineix';
	}
	});
};
//app下载设置cookie为一天
$(function(){
	if(phenix.read_cookie("closeload") == 0){
		$('.appiosload').remove();
	}else{
		window.setTimeout(function() { $('.appiosload').fadeIn(1000);},2000);
	}
	$('.apploadclose').on('click',function(){
		phenix.create_cookie("closeload","0",{ expires:1 });
	})
});
//关闭弹出层
$('.header .close.icon').click(function(){
     $('.ui.modal').modal('hide');
  });

(function($){
	$.fn.extend({
		insertAtCaret: function(myValue){
			var $t=$(this)[0];
			if (document.selection) {
				this.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
				this.focus();
			}
			else 
				if ($t.selectionStart || $t.selectionStart == '0') {
					var startPos = $t.selectionStart;
					var endPos = $t.selectionEnd;
					var scrollTop = $t.scrollTop;
					$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
					this.focus();
					$t.selectionStart = startPos + myValue.length;
					$t.selectionEnd = startPos + myValue.length;
					$t.scrollTop = scrollTop;
				}
				else {
					this.value += myValue;
					this.focus();
				}
		}
	})	
})(jQuery);
