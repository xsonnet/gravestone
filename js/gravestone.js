;(function(){
	var exmarkdown = function(el, opt) {
		var that = this;
		this.defaults = {
			iconlibrary: 'fa',
			language: 'zh',
			additionalButtons: [
			    [{
					name: "groupUrl",
					data: [{
						name: 'insertUrl',
						title: 'URL链接',
						hotkey: 'Ctrl+L',
						icon: 'fa fa-link',
						callback: function(e){
							var chunk, cursor, selected = e.getSelection();
							chunk = selected.length === 0 ? '输入链接说明' : selected.text;
							e.replaceSelection('[' + chunk + '](http://)');
							cursor = selected.start + 1;
							e.setSelection(cursor, cursor + chunk.length);
						}
					},{
						name: 'insertImg',
						title: '图片',
						hotkey: 'Ctrl+G',
						icon: 'fa fa-picture-o',
						callback: function(e){
							that.insertImg(opt.url, function(json){
								var chunk, cursor, selected = e.getSelection();
								chunk = selected.length === 0 ? '输入图片描述' : selected.text;
								e.replaceSelection('![' + chunk + '](' + json.url + ' "输入图片标题")');
								cursor = selected.start + 2;
								e.setSelection(cursor, cursor + chunk.length);
							});
						}
					}]
			    }]
		    ],
		    reorderButtonGroups: ['groupFont', 'groupMisc', 'groupUrl', 'groupUtil']
		};
		this.options = $.extend({}, this.defaults, opt);
		el.markdown(this.options);
	};
	exmarkdown.prototype = {
		popup: function(opt) {
			var that = this;
			var _mask = $('<div/>').addClass('md-mask');

			var _header = $('<div/>').addClass('md-box-header').append($('<div/>', {
				'class': 'md-box-title',
				'text': opt.title
			})).append($('<button/>', {
				'class': 'md-box-close',
				'html': '<i class="fa fa-close"></i>'
			}).click(function(){
				_mask.remove();
			}));

			var _body = $('<div/>').addClass('md-box-body').append($('<div/>', {
				'class': 'md-box-tip',
				'text': opt.tip
			}));
			var _input = $('<input/>', {
				'class': 'md-box-input',
				'placeholder': 'http://example.com/abc.jpg'
			});
			var _upload = $('<button/>', {
				'class': 'md-box-upload',
				'html': '<i class="fa fa-upload"></i>'
			}).click(function(){
				that.upload({
					url: opt.url,
					success: function(result) {
						opt.callback(result);
						_mask.remove();
					}
				});
			});
			var _field = $('<div/>').addClass('md-box-field').append(_input).append(_upload);

			var _ok = $('<button/>').addClass('md-btn-ok').text('确定').click(function(){
				if (_input.val().trim().length > 0) opt.callback(_input.val());
			});
			var _cancel = $('<button/>').text('取消').click(function(){
				_mask.remove();
			});
			var _ctrl = $('<div/>').addClass('md-box-ctrl').append(_cancel).append(_ok);
			
			_body.append(_field).append(_ctrl);
			var _box = $('<div/>').addClass('md-box').append(_header).append(_body);
			$('body').append(_mask.append(_box));
		},
		insertImg: function(url, callback) {
			this.popup({
				title: '插入图片',
				tip: '输入图片地址或者选择要上传的文件',
				url: url,
				callback: callback
			});
		},
		upload: function(opt) {
			var _iframe = $('<iframe/>', {
				style: 'display:none'
			});
			var _form = $('<form/>', {
				'action': opt.action,
				'method': 'post',
				'enctype': 'multipart/form-data'
			});
			var _file = $('<input/>', {
				'accept': '.jpg,.png',
				'name': 'file',
				'type': 'file'
			}).change(function(){
				$.ajax({
					url: opt.url,
					type: 'post',
					cache: false,
					data: new FormData(_form[0]),
					dataType: 'json',
					processData: false,
					contentType: false
				}).done(function(json){
					opt.success(json);
					_iframe.remove();
				});
			}).trigger('click');
			$('body').append(_iframe.append(_form.append(_file)));
		}
	};
	$.fn.gmd = function(options) {
		new exmarkdown(this, options);
	}
})();