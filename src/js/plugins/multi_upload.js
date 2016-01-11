/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
    // Add an option for your plugin.
    $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
        allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif'],
        customImageButtons: {},
        
        defaultImageTitle: 'Image title',
        defaultImageWidth: 300,
        defaultImageDisplay: 'block',
        defaultImageAlignment: 'center',
        
        imageDeleteConfirmation: true,
        imageDeleteURL: null,
        imageDeleteParams: {},
        
        imageMove: true,
        imageResize: true,
        imageLink: true,
        imageTitle: true,
        imageUpload: true,
        
        imageUploadParams: {},
        imageUploadParam: 'file',
        imageUploadURL: 'http://i.froala.com/upload',
        
        maxImageSize: 1024 * 1024 * 5, // 10 Mb.,
        pasteImage: true,
        textNearImage: true,
        
        assetType: 2,
        assetDomain: 'asset',
        parent_id: 0,
        fetchUploadURL: ''
    });
    
    $.Editable.commands = $.extend($.Editable.commands, {
        multiUpload: {
            title: 'Multi Upload',
            icon: 'fa fa-picture-o',
            callback: function () {
                this.insertAsset();
            },
            undo: false
        }
    });
    
    $.Editable.prototype.showAssetWrapper = function () {
        if (this.$asset_wrapper) {
            this.$asset_wrapper.show();
        }
    };

    $.Editable.prototype.hideAssetWrapper = function () {
        if (this.$asset_wrapper) {
            this.$asset_wrapper.hide();
        }
    };
    
    $.Editable.prototype.showAssetUpload = function () {
        this.hidePopups();

        this.showAssetWrapper();
    };
    
    $.Editable.prototype.insertAsset = function () {
        // Close image mode.
        this.closeImageMode();
        this.imageMode = false;

        this.showAssetUpload();
        this.saveSelectionByMarkers();
        
        if (!this.options.inlineMode) {
            this.positionPopup('multiUpload');
        }
    }
    
    $.Editable.prototype.assetUploadHTML = function () {
        var html = '<div class="froala-popup froala-asset-popup" style="display: none;"><h4><span data-text="true">Multi Upload</span><small> (小于5M,jpg、jpeg的格式）</small><i title="Cancel" class="fa fa-times" id="f-asset-close-' + this._id + '"></i></h4>';

        html += '<div id="f-asset-list-' + this._id + '" class="editor-assets">';

        html += '<div id="multi-upload-' + this._id + '"></div>';
      
        html += '<div id="multi-list-' + this._id + '" class="ui three blocks"></div>';
      
        html += '</div>';
      
        html += '<div class="select-result"><div class="ui ok active inverted magenta button">确定插入</div><div class="ui notok inverted grey button">取消</div><div class="ui remove inverted red button">删除所选</div></div>';
      
        html += '</div>';

        return html;
    }
    
    $.Editable.prototype.multiUploadAsset = function () {
        // Add file wrapper to editor.
        this.$asset_wrapper = $(this.assetUploadHTML());
        this.$popup_editor.append(this.$asset_wrapper);
        this.$select_assets = new Array();
        this.$select_ids = new Array();
        
        var that = this;
        
        this.addListener('hidePopups', $.proxy(function () {
            this.hideAssetWrapper();
        }, this));
        
        // 加载
        this.loadAssets();
        
        var uploader = new qq.FineUploader({
            element: $('#multi-upload-' + that._id)[0],
          	request: {
    			inputName: that.options.imageUploadParam,
    			params: that.options.imageUploadParams,
            	endpoint: that.options.imageUploadURL
          	},
    		text: {
                uploadButton: '<a class="ui active grey labeled icon button" href="javascript:void(0);"><i class="cloud upload icon"></i>选择图片</a>'
    		},
    		validation: {
    	        allowedExtensions: ['jpeg', 'jpg', 'png', 'gif'],
    	        sizeLimit: 5245728
    	    },
            callbacks: {
                onUpload: function(id, name){
                    that.options.imageUploadParams['x:ord'] += id;
                    uploader.setParams(that.options.imageUploadParams);
                },
                onComplete: function(id, name, result, maybeXhr){
            		console.log('id: ' + id + ' name: ' + name + 'result: ' + result);
                    if(!result.is_error){
                        $('.qq-upload-list').children().eq(id).fadeOut();
                        $.getJSON(that.options.fetchUploadURL, {'assets': result.data.ids, 'asset_type': that.options.assetType, 'asset_domain': that.options.assetDomain }, function(rs){
                            if(rs.is_error){
                                phenix.show_error_message(rs.message);
                                return;
                            }
                            
                            that.renderAssets(rs);
                            // 新增id
                            that.buildAssetIds(rs);
                        });
                    }else{
                        phenix.show_error_message(result.message);
                    }
                }
            }
        });
        
        // bind 事件
        $('#multi-list-' + this._id ).find('img').livequery(function(e){
            $(this).bind('click', function(){
                var src = $(this).parent('.image').data('src'),asset_id = $(this).parent('.image').data('id');
                if(src){
                    that.$select_assets.push(src);
                    that.$select_ids.push(asset_id);
                    
                    $(this).after('<div class="cover"><i class="check circle icon"></i></div>');
                }
            });
        })
        .end()
        .find('.cover').livequery(function(e){
            $(this).bind('click', function(){
                console.log('click cover');
                var src = $(this).parent('.image').data('src'),index = -1;
                $(this).remove();
                
                // 从选择中删除
                for(var i=0,max=that.$select_assets.length;i<max;i++){
                    if(that.$select_assets[i] == src){
                        index = i;
                    }
                }
                if (index != -1){
                    that.$select_assets.splice(index, 1);
                    that.$select_ids.splice(index, 1);
                }
            });
        });
        
        // insert asset
        this.$asset_wrapper.on('click', 'div.ui.ok.button', $.proxy(function() {
            if(this.$select_assets.length){
                var img_s = '';
                for(var i=0,max=that.$select_assets.length; i<max+1; i++){
                    // that.writeImage(that.$select_assets[i]);
                    img_s += '<p><img class="fr-fin fr-dib" src="'+ that.$select_assets[i] +'" alt="'+ that.options.defaultImageTitle +'"></p>'
                }
                this.insertHTML(img_s);
                
                this.cancelSelected();
                
                this.$bttn_wrapper.show();
                this.hideAssetWrapper();
                
                if (this.options.inlineMode && !this.imageMode && this.options.buttons.length === 0) {
                    this.hide();
                }

                this.restoreSelection();
                this.focus();

                if (!this.options.inlineMode) {
                    this.hide();
                }
            }else{
                phenix.show_error_note('请至少选择一个要插入的图片！');
            }
        }, this));
        
        // remove asset
        this.$asset_wrapper.on('click', 'div.ui.remove.button', $.proxy(function() {
            if(that.$select_assets.length){
                for(var i=0,max=that.$select_assets.length; i<max; i++){
                    var asset_id = that.$select_ids[i];
                    // 删除
                    $('#asset-' + asset_id).remove();
                    $.getJSON(this.options.imageDeleteURL, {asset_id: asset_id}, function(rs){
                        if(rs.is_error){
                            phenix.show_error_note(rs.message);
                            return;
                        }
                    });
                }
            }else{
                phenix.show_error_note('请至少选择一个要删除的图片！');
            }
        }, this));
        
        // cancel
        this.$asset_wrapper.on('click', 'div.ui.notok.button', $.proxy(function(){
            this.cancelSelected();
            
            this.$bttn_wrapper.show();
            this.hideAssetWrapper();
            
            if (this.options.inlineMode && !this.imageMode && this.options.buttons.length === 0) {
                this.hide();
            }

            this.restoreSelection();
            this.focus();

            if (!this.options.inlineMode) {
                this.hide();
            }
            
        }, this));
        
        // close
        this.$asset_wrapper.on(this.mouseup, 'i#f-asset-close-' + this._id, $.proxy(function () {
            this.$bttn_wrapper.show();
            this.hideAssetWrapper();

            if (this.options.inlineMode && !this.imageMode && this.options.buttons.length === 0) {
                this.hide();
            }

            this.restoreSelection();
            this.focus();

            if (!this.options.inlineMode) {
                this.hide();
            }
        }, this));
    }
    
    // 取消选择
    $.Editable.prototype.cancelSelected = function(){
        this.$select_assets = [];
        $('#multi-list-' + this._id ).find('.cover').remove();
    }
    
    // 加载附件、图片
    $.Editable.prototype.loadAssets = function(){
        var that = this;
        if(this.options.parent_id){
            $.getJSON(this.options.fetchUploadURL, { parent_id: this.options.parent_id, 'asset_type': this.options.assetType, 'asset_domain': this.options.assetDomain }, function(rs){
                if(rs.is_error){
                    phenix.show_error_message(rs.message);
                    return;
                }
            
                that.renderAssets(rs);
            });
        }
    }
    
    $.Editable.prototype.renderAssets = function (result) {
        var template = '{{#data}}<div class="block" id="asset-{{ id }}"><div class="image" data-id="{{ id }}" data-src="{{ thumbnails.hd.view_url }}"><img src="{{ thumbnails.mini.view_url }}" /><p>{{ filename }}</p></div></div>{{/data}}'
        var rendered = Mustache.render(template, result);
        
        $('#multi-list-' + this._id )
            .prepend(rendered);
    }
    
    $.Editable.prototype.buildAssetIds = function (result) {
        var template = '{{#data}}{{ id }},{{/data}}'
        var rendered = Mustache.render(template, result);
        
        console.log('value: ' + rendered);
        var current = $('#newadd_asset_ids').val();
        
        current += rendered;
        
        $('#newadd_asset_ids').val(current);
    }
    
    // Register your plugin.
    $.Editable.initializers.push($.Editable.prototype.multiUploadAsset);

})(jQuery);
